import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../templates/entities/template.entity';
import { CreateResumeDto } from './dto/create-resume.dto';
import { PatchResumeSectionDto } from './dto/patch-resume-section.dto';
import { UpdateResumeContentDto } from './dto/update-resume-content.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ExportHistory } from './entities/export-history.entity';
import { ResumeContent } from './entities/resume-content.entity';
import { Resume } from './entities/resume.entity';
import { slugify } from '../../utils/slug.util';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumeRepo: Repository<Resume>,
    @InjectRepository(ResumeContent)
    private readonly contentRepo: Repository<ResumeContent>,
    @InjectRepository(ExportHistory)
    private readonly exportHistoryRepo: Repository<ExportHistory>,
    @InjectRepository(Template)
    private readonly templateRepo: Repository<Template>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(userId: number) {
    const resumes = await this.resumeRepo.find({
      where: { userId, isDeleted: false },
      relations: ['content', 'template'],
      order: { updatedAt: 'DESC' },
    });
    return resumes.map((resume) => this.sanitizeResume(resume));
  }

  async create(userId: number, dto: CreateResumeDto) {
    if (dto.templateId) {
      await this.ensureTemplateExists(dto.templateId);
    }

    const slug = dto.slug ?? (await this.generateUniqueSlug(dto.title));
    if (dto.slug) {
      await this.ensureSlugUnique(dto.slug);
    }
    const resume = this.resumeRepo.create({
      title: dto.title,
      slug,
      isPublic: dto.isPublic ?? false,
      userId,
      templateId: dto.templateId ?? null,
    });
    const saved = await this.resumeRepo.save(resume);

    if (dto.content) {
      await this.contentRepo.save({
        resumeId: saved.id,
        isActive: true,
        isDeleted: false,
        ...dto.content,
      });
    }

    await this.invalidateCache(saved.id);
    return this.findOne(saved.id, userId);
  }

  async findOne(id: number, userId: number) {
    const cacheKey = this.getCacheKey(id);
    const cached = await this.cacheManager.get<Resume>(cacheKey);
    if (cached && cached.userId === userId) {
      return cached;
    }

    const resume = await this.resumeRepo.findOne({
      where: { id, userId, isDeleted: false },
      relations: ['content', 'template'],
    });
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    const sanitized = this.sanitizeResume(resume);
    await this.cacheManager.set(cacheKey, sanitized, 3600);
    return sanitized;
  }

  async update(id: number, userId: number, dto: UpdateResumeDto) {
    const resume = await this.findOne(id, userId);
    if (dto.slug && dto.slug !== resume.slug) {
      await this.ensureSlugUnique(dto.slug, id);
    }
    if (dto.templateId && dto.templateId !== resume.templateId) {
      await this.ensureTemplateExists(dto.templateId);
    }

    const { content, ...resumePayload } = dto;

    const updated = await this.resumeRepo.save({
      ...resume,
      ...resumePayload,
      templateId: resumePayload.templateId ?? resume.templateId,
    });

    if (content) {
      await this.contentRepo.save({
        ...(resume.content ?? { resumeId: id }),
        resumeId: id,
        isActive: true,
        isDeleted: false,
        ...content,
      });
    }

    await this.invalidateCache(id);
    return this.findOne(updated.id, userId);
  }

  async remove(id: number, userId: number) {
    const resume = await this.findOne(id, userId);
    resume.isDeleted = true;
    resume.isActive = false;
    await this.resumeRepo.save(resume);
    if (resume.content) {
      resume.content.isDeleted = true;
      resume.content.isActive = false;
      await this.contentRepo.save(resume.content);
    }
    await this.invalidateCache(id);
    return { message: 'Resume deleted' };
  }

  async duplicate(id: number, userId: number) {
    const existing = await this.findOne(id, userId);
    const duplicateResume = this.resumeRepo.create({
      title: `${existing.title} Copy`,
      slug: await this.generateUniqueSlug(existing.title),
      isPublic: false,
      userId,
      templateId: existing.templateId,
    });
    const saved = await this.resumeRepo.save(duplicateResume);

    if (existing.content) {
      await this.contentRepo.save({
        resumeId: saved.id,
        personalInfo: existing.content.personalInfo,
        summary: existing.content.summary,
        experience: existing.content.experience,
        education: existing.content.education,
        skills: existing.content.skills,
        projects: existing.content.projects,
        certifications: existing.content.certifications,
        languages: existing.content.languages,
        customSections: existing.content.customSections,
        isActive: true,
        isDeleted: false,
      });
    }

    await this.invalidateCache(saved.id);
    return this.findOne(saved.id, userId);
  }

  async getContent(id: number, userId: number) {
    const resume = await this.findOne(id, userId);
    return resume.content;
  }

  async updateContent(id: number, userId: number, dto: UpdateResumeContentDto) {
    await this.findOne(id, userId);
    const existing = await this.contentRepo.findOne({
      where: { resumeId: id, isDeleted: false },
    });
    await this.contentRepo.save({
      ...(existing ?? { resumeId: id }),
      resumeId: id,
      isActive: true,
      isDeleted: false,
      ...dto,
    });
    await this.invalidateCache(id);
    return this.getContent(id, userId);
  }

  async patchSection(id: number, userId: number, dto: PatchResumeSectionDto) {
    await this.findOne(id, userId);
    const content = await this.contentRepo.findOne({
      where: { resumeId: id, isDeleted: false },
    });
    if (!content) {
      throw new NotFoundException('Resume content not found');
    }
    if (!(dto.section in content)) {
      throw new ForbiddenException('Section does not exist on resume');
    }
    const mutableContent = content as unknown as Record<string, unknown>;
    mutableContent[dto.section] = dto.data;
    await this.contentRepo.save(content);
    await this.invalidateCache(id);
    return this.getContent(id, userId);
  }

  async exportResume(id: number, userId: number, format: 'pdf' | 'docx') {
    if (!['pdf', 'docx'].includes(format)) {
      throw new ForbiddenException('Unsupported export format');
    }
    const resume = await this.findOne(id, userId);
    const slug = resume.slug ?? `resume-${resume.id}`;
    const fileUrl = `https://cdn.resume-builder.local/resumes/${slug}.${format}`;
    const history = await this.exportHistoryRepo.save({
      resumeId: resume.id,
      format,
      fileUrl,
    });
    return history;
  }

  async getExportHistory(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.exportHistoryRepo.find({
      where: { resumeId: id, isDeleted: false },
      order: { exportedAt: 'DESC' },
    });
  }

  private getCacheKey(id: number) {
    return `resume:${id}`;
  }

  private async invalidateCache(id: number) {
    await this.cacheManager.del(this.getCacheKey(id));
  }

  private async ensureTemplateExists(templateId: number) {
    const template = await this.templateRepo.findOne({
      where: { id: templateId, isDeleted: false, isActive: true },
    });
    if (!template) {
      throw new NotFoundException('Template not found');
    }
  }

  private async generateUniqueSlug(title: string) {
    let slug = slugify(title);
    let exists = await this.resumeRepo.findOne({
      where: { slug, isDeleted: false },
    });
    while (exists) {
      slug = slugify(title);
      exists = await this.resumeRepo.findOne({
        where: { slug, isDeleted: false },
      });
    }
    return slug;
  }

  private async ensureSlugUnique(slug: string, excludeId?: number) {
    const existing = await this.resumeRepo.findOne({
      where: { slug, isDeleted: false },
    });
    if (existing && existing.id !== excludeId) {
      throw new ForbiddenException('Slug already in use');
    }
  }

  private sanitizeResume(resume: Resume): Resume {
    if (resume.content && resume.content.isDeleted) {
      resume.content = null;
    }
    if (resume.template && resume.template.isDeleted) {
      resume.template = null;
    }
    return resume;
  }
}

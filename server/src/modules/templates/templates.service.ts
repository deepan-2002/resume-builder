import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterTemplatesDto } from './dto/filter-templates.dto';
import { Template } from './entities/template.entity';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepo: Repository<Template>,
  ) {}

  async findAll(filter: FilterTemplatesDto) {
    const where: Record<string, unknown> = {
      isDeleted: false,
      isActive: true,
    };
    if (filter.category) {
      where.category = filter.category;
    }
    if (filter.isPremium !== undefined) {
      where.isPremium = filter.isPremium === 'true';
    }
    return this.templateRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const template = await this.templateRepo.findOne({
      where: { id, isDeleted: false },
    });
    if (!template) {
      throw new NotFoundException('Template not found');
    }
    return template;
  }

  async getCategories() {
    const categories = await this.templateRepo
      .createQueryBuilder('template')
      .select('DISTINCT template.category', 'category')
      .where('template.category IS NOT NULL')
      .andWhere('template.is_deleted = false')
      .andWhere('template.is_active = true')
      .orderBy('template.category', 'ASC')
      .getRawMany();
    return categories.map((item) => item.category);
  }
}

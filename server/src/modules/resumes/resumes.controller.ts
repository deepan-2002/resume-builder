import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { PatchResumeSectionDto } from './dto/patch-resume-section.dto';
import { UpdateResumeContentDto } from './dto/update-resume-content.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResumesService } from './resumes.service';
import { AuthenticatedRequest } from '../../common/types/authenticated-request.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.resumesService.findAll(request.user.id);
  }

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateResumeDto) {
    return this.resumesService.create(request.user.id, dto);
  }

  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.resumesService.findOne(id, request.user.id);
  }

  @Put(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateResumeDto,
  ) {
    return this.resumesService.update(id, request.user.id, dto);
  }

  @Delete(':id')
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.resumesService.remove(id, request.user.id);
  }

  @Post(':id/duplicate')
  duplicate(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.resumesService.duplicate(id, request.user.id);
  }

  @Get(':id/content')
  getContent(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.resumesService.getContent(id, request.user.id);
  }

  @Put(':id/content')
  updateContent(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateResumeContentDto,
  ) {
    return this.resumesService.updateContent(id, request.user.id, dto);
  }

  @Patch(':id/sections')
  patchSections(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PatchResumeSectionDto,
  ) {
    return this.resumesService.patchSection(id, request.user.id, dto);
  }

  @Post(':id/export/:format')
  exportResume(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Param('format') format: string,
  ) {
    return this.resumesService.exportResume(
      id,
      request.user.id,
      format as 'pdf' | 'docx',
    );
  }

  @Get(':id/exports')
  getExportHistory(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.resumesService.getExportHistory(id, request.user.id);
  }
}

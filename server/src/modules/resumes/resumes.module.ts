import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from '../templates/entities/template.entity';
import { ExportHistory } from './entities/export-history.entity';
import { ResumeContent } from './entities/resume-content.entity';
import { Resume } from './entities/resume.entity';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resume, ResumeContent, ExportHistory, Template]),
  ],
  controllers: [ResumesController],
  providers: [ResumesService],
  exports: [ResumesService],
})
export class ResumesModule {}

import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateResumeContentDto {
  @IsOptional()
  @IsObject()
  personalInfo?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsObject()
  experience?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  education?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  skills?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  projects?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  certifications?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  languages?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  customSections?: Record<string, unknown>;
}

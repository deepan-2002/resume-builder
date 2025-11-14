import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateResumeContentDto } from './update-resume-content.dto';

export class CreateResumeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  templateId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateResumeContentDto)
  content?: UpdateResumeContentDto;
}

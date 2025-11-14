import { IsBooleanString, IsOptional, IsString } from 'class-validator';

export class FilterTemplatesDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBooleanString()
  isPremium?: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class PatchResumeSectionDto {
  @IsString()
  @IsNotEmpty()
  section: string;

  @IsNotEmpty()
  data: unknown;
}

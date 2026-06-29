import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateProgramDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  longDescription: string;

  @IsString()
  iconName: string;

  @IsString()
  imageUrl: string;

  @IsString()
  impactStat: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

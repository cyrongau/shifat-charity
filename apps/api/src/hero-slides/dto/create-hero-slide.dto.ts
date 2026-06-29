import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateHeroSlideDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  ctaText?: string;

  @IsOptional()
  @IsString()
  ctaLink?: string;

  @IsOptional()
  @IsString()
  secondaryCtaText?: string;

  @IsOptional()
  @IsString()
  secondaryCtaLink?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

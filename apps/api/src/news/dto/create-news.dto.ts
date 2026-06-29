import { IsString, IsOptional, IsBoolean, IsDateString, IsEnum } from 'class-validator';
import { NewsCategory } from '@prisma/client';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  excerpt: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(NewsCategory)
  category?: NewsCategory;

  @IsString()
  imageUrl: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}

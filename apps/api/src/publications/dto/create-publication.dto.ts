import { IsString, IsOptional, IsBoolean, IsDateString, IsEnum } from 'class-validator';
import { PublicationCategory } from '@prisma/client';

export class CreatePublicationDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(PublicationCategory)
  category: PublicationCategory;

  @IsString()
  fileUrl: string;

  @IsString()
  pages: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsDateString()
  publicationDate: string;
}

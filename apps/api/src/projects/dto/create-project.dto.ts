import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
  @IsString()
  programId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsString()
  imageUrl: string;

  @IsString()
  beneficiaries: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

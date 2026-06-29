import { IsString, IsOptional, IsBoolean, IsEnum, IsArray } from 'class-validator';
import { JobType } from '@prisma/client';

export class CreateCareerOpportunityDto {
  @IsString()
  title: string;

  @IsString()
  department: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsEnum(JobType)
  type?: JobType;

  @IsString()
  description: string;

  @IsArray()
  requirements: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

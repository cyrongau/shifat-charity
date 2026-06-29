import { IsString, IsOptional, IsBoolean, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { CampaignStatus } from '@prisma/client';

export class CreateCampaignDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  longDescription: string;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsNumber()
  targetAmount: number;

  @IsOptional()
  @IsNumber()
  currentRaised?: number;

  @IsOptional()
  @IsNumber()
  progressPercentage?: number;

  @IsString()
  region: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

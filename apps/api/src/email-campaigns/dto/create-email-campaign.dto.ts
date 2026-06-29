import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CampaignTargetType } from '@prisma/client';

export class CreateEmailCampaignDto {
  @IsString()
  subject: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(CampaignTargetType)
  targetType?: CampaignTargetType;

  @IsOptional()
  @IsString()
  mailingListId?: string;

  @IsOptional()
  @IsString()
  scheduledAt?: string;
}

import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { PartnerType } from '@prisma/client';

export class CreatePartnerDto {
  @IsString()
  name: string;

  @IsString()
  logoUrl: string;

  @IsEnum(PartnerType)
  type: PartnerType;

  @IsString()
  logoBg: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

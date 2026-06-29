import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { TeamCategory } from '@prisma/client';

export class CreateTeamMemberDto {
  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsString()
  bio: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsEnum(TeamCategory)
  category?: TeamCategory;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

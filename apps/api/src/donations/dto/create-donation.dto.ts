import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { DonationFrequency, PaymentMethod } from '@prisma/client';

export class CreateDonationDto {
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsEnum(DonationFrequency)
  frequency?: DonationFrequency;

  @IsString()
  designation: string;

  @IsOptional()
  @IsString()
  campaignId?: string;

  @IsOptional()
  @IsString()
  donorName?: string;

  @IsOptional()
  @IsString()
  donorEmail?: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}

import { IsString, IsOptional } from 'class-validator';

export class CreateContactDto {
  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  subject: string;

  @IsString()
  message: string;
}

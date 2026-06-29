import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  careerId: string;

  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  resumeUrl: string;

  @IsOptional()
  @IsString()
  coverLetter?: string;
}

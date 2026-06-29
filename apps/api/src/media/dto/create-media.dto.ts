import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  filename: string;

  @IsString()
  originalName: string;

  @IsString()
  mimeType: string;

  @IsNumber()
  fileSize: number;

  @IsString()
  bucket: string;

  @IsString()
  objectKey: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  uploadedById?: string;
}

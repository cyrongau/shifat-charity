import { IsString, IsOptional } from 'class-validator';

export class CreateMailingListDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

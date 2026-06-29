import { IsOptional, IsString, IsArray } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class SearchDto extends PaginationDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  types?: string[];
}

import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindHeroSlidesDto extends PaginationDto {
  @IsOptional()
  @IsString()
  pageKey?: string;
}

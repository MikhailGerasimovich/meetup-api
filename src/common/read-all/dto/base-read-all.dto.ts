import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import { SortingDto } from '../sorting/dto/sorting.dto';

export class BaseReadAllDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  public pagination?: PaginationDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SortingDto)
  public sorting?: SortingDto;
}

import { Type } from 'class-transformer';
import { IsDefined, IsInt, Min } from 'class-validator';

export class PaginationDto {
  @IsDefined()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  public page: number;

  @IsDefined()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  public size: number;

  @IsDefined()
  get offset() {
    return (this.page - 1) * this.size;
  }
}

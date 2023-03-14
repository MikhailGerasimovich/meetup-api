import { IsDefined, IsOptional, IsString } from 'class-validator';
import { BaseReadAllDto } from 'src/common/read-all/dto/base-read-all.dto';

export class ReadAllTagDto extends BaseReadAllDto {
  @IsOptional()
  @IsDefined()
  @IsString()
  public name?: string;
}

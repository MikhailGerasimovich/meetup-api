import { IsDefined, IsOptional, IsString, IsDate, IsArray } from 'class-validator';
import { BaseReadAllDto } from 'src/common/read-all/dto/base-read-all.dto';

export class ReadAllMeetupDto extends BaseReadAllDto {
  @IsOptional()
  @IsDefined()
  @IsString()
  public title?: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  public description?: string;

  @IsOptional()
  @IsDefined()
  @IsString({ each: true })
  @IsArray()
  public tags?: string[];

  @IsOptional()
  @IsDefined()
  @IsDate()
  public date?: Date;

  @IsOptional()
  @IsDefined()
  @IsString()
  public place?: string;
}

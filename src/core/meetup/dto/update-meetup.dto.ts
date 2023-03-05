import { IsString, IsArray, IsDate, IsOptional, IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateMeetupDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDefined()
  @IsString({ each: true })
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date?: Date;

  @IsOptional()
  @IsString()
  place?: string;
}

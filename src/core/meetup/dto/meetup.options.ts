import { IsString, IsArray, IsDate, IsOptional, IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';

export class MeetupOptions {
  @IsOptional()
  @IsString()
  id?: string;

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

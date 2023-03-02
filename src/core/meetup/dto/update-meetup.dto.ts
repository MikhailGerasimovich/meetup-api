import { IsNotEmpty, IsString, IsArray, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateMeetupDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  tags: string[];

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => Date.parse(value))
  date: Date;

  @IsNotEmpty()
  @IsString()
  place: string;
}

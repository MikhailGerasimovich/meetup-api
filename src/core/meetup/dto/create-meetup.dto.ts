import { IsNotEmpty, IsString, IsArray, IsDate, IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMeetupDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsDefined()
  @IsString({ each: true })
  @IsArray()
  tags: string[];

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;

  @IsNotEmpty()
  @IsString()
  place: string;
}

import { IsString, IsOptional } from 'class-validator';

export class TagOptions {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

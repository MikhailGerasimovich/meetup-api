import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UserOptions {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  login?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;
}

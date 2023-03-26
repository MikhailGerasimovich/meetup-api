import { IsNotEmpty, IsString, IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'password is too short' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

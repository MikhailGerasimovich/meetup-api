import { IsDefined, IsOptional, IsString, IsDate, IsArray, IsEmail } from 'class-validator';
import { BaseReadAllDto } from 'src/common/read-all/dto/base-read-all.dto';

export class ReadAllUserDto extends BaseReadAllDto {
  @IsOptional()
  @IsDefined()
  @IsString()
  public login?: string;

  @IsOptional()
  @IsDefined()
  @IsString()
  public password?: string;

  @IsOptional()
  @IsString({ each: true })
  @IsEmail()
  public email?: string;

  @IsOptional()
  @IsDefined()
  @IsString({ each: true })
  @IsArray()
  public roles?: string[];
}

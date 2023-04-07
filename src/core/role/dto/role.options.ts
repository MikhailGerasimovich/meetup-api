import { IsString, IsOptional } from 'class-validator';

export class RoleOptions {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

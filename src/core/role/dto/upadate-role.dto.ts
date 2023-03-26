import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  name?: string;
}

import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/core/role/role.model';

export class PayloadDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsArray()
  roles: Role[];
}

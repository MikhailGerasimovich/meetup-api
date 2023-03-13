import { IsDefined, IsIn, IsString } from 'class-validator';

export class SortingDto {
  @IsDefined()
  @IsString()
  public column: string;

  @IsDefined()
  @IsIn(['DESC', 'ASC'])
  public direction: 'DESC' | 'ASC';
}

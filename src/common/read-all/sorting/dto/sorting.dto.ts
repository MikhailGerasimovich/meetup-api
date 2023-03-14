import { IsDefined, IsIn, IsString } from 'class-validator';
import { defaultSorting } from 'src/common/constants/sorting.constants';

export class SortingDto {
  @IsDefined()
  @IsString()
  public column: string = defaultSorting.column;

  @IsDefined()
  @IsIn(['DESC', 'ASC'])
  public direction: 'DESC' | 'ASC' = defaultSorting.direction;
}

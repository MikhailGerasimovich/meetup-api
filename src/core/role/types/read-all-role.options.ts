import { IPaginationOptions } from 'src/common/read-all/pagination/types/pagination.options';
import { ISortingOptions } from 'src/common/read-all/sorting/types/sorting.options';

export interface IReadAllRoleOptions {
  pagination?: IPaginationOptions;
  sorting?: ISortingOptions;
}

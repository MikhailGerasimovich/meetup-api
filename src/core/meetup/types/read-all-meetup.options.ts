import { IPaginationOptions } from 'src/common/read-all/pagination/types/pagination.options';
import { ISortingOptions } from 'src/common/read-all/sorting/types/sorting.options';

export interface IReadAllMeetupOptions {
  filter: {
    title?: string;
    description?: string;
    date?: Date;
    place?: string;
  };
  pagination?: IPaginationOptions;
  sorting?: ISortingOptions;
}

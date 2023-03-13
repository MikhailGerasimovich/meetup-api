import { IPaginationOptions } from '../read-all/pagination/types/pagination.options';

export const defaultPagination: IPaginationOptions = {
  page: 1,
  size: 20,
  get offset(): number {
    return (this.page - 1) * this.size;
  },
};

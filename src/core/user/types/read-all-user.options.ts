import { Op } from 'sequelize';
import { IPaginationOptions } from 'src/common/read-all/pagination/types/pagination.options';
import { ISortingOptions } from 'src/common/read-all/sorting/types/sorting.options';

export interface IReadAllUserOptions {
  filter?: {
    login?: string;
    email?: string;
  };
  pagination?: IPaginationOptions;
  sorting?: ISortingOptions;
}

export class UserFiltration {
  static getLikeFilters(filter) {
    const userFilters = {};

    for (let [key, value] of Object.entries(filter)) {
      userFilters[key] = { [Op.like]: `%${value}%` };
    }

    return { userFilters };
  }
}

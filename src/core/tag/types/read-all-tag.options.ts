import { Op } from 'sequelize';
import { IPaginationOptions } from 'src/common/read-all/pagination/types/pagination.options';
import { ISortingOptions } from 'src/common/read-all/sorting/types/sorting.options';

export interface IReadAllTagOptions {
  filter?: {
    name?: string;
  };
  pagination?: IPaginationOptions;
  sorting?: ISortingOptions;
}

export class TagFiltration {
  static getLikeFilters(filter) {
    const tagFilters = {};

    for (let [key, value] of Object.entries(filter)) {
      tagFilters[key] = { [Op.like]: `%${value}%` };
    }
    return {
      tagFilters,
    };
  }
}

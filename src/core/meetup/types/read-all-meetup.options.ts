import { Op } from 'sequelize';
import { IPaginationOptions } from 'src/common/read-all/pagination/types/pagination.options';
import { ISortingOptions } from 'src/common/read-all/sorting/types/sorting.options';

export interface IReadAllMeetupOptions {
  filter?: {
    title?: string;
    description?: string;
    tags?: string[];
    date?: Date;
    place?: string;
  };
  pagination?: IPaginationOptions;
  sorting?: ISortingOptions;
}

export class MeetupFiltration {
  static getLikeFilters(filter) {
    const meetupFilters = {};
    const tagsFilters = {};

    for (let [key, value] of Object.entries(filter)) {
      if (key !== 'tags') {
        meetupFilters[key] = { [Op.like]: `%${value}%` };
      }

      if (key === 'tags' && Array.isArray(value)) {
        tagsFilters['name'] = { [Op.like]: { [Op.any]: value } };
      }
    }
    return {
      meetupFilters,
      tagsFilters,
    };
  }
}

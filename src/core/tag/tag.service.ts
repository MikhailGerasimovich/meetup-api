import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { defaultPagination } from 'src/common/constants/pagination.constants';
import { defaultSorting } from 'src/common/constants/sorting.constants';
import { ReadAllResult } from 'src/common/read-all/types/read-all.types';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagOptions } from './dto/tag.options';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './tag.model';
import { IReadAllTagOptions, TagFiltration } from './types/read-all-tag.options';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag) private readonly tagRepository: typeof Tag) {}

  public async create(createTagDto: CreateTagDto, transaction?: Transaction): Promise<Tag> {
    const existingTag = await this.readOneBy({ name: createTagDto.name });
    if (existingTag) {
      throw new BadRequestException(`tag with name=${createTagDto.name} already exists`);
    }

    const tag = await this.tagRepository.create(createTagDto, { transaction });
    return tag;
  }

  public async readAll(readOptions: IReadAllTagOptions): Promise<ReadAllResult<Tag>> {
    const pagination = readOptions.pagination ?? defaultPagination;
    const sorting = readOptions.sorting ?? defaultSorting;
    const filter = TagFiltration.getLikeFilters(readOptions.filter);

    const { count, rows } = await this.tagRepository.findAndCountAll({
      where: { ...filter.tagFilters },
      include: { all: true },
      distinct: true,
      limit: pagination.size,
      offset: pagination.offset,
      order: [[sorting.column, sorting.direction]],
    });

    return {
      totalRecordsNumber: count,
      entities: rows,
    };
  }

  public async readOneBy(tagOptions: TagOptions): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { ...tagOptions },
    });
    return tag;
  }

  public async update(id: string, updateTagDto: UpdateTagDto) {
    const existingTag = await this.readOneBy({ id });
    if (!existingTag) {
      throw new NotFoundException(`tag with id=${id} not found`);
    }

    const sameNameTag = await this.readOneBy({ name: updateTagDto.name });
    if (sameNameTag) {
      throw new BadRequestException(`tag with name=${updateTagDto.name} already exists`);
    }

    const [nemberUpdatedRows, updatedTags] = await this.tagRepository.update(updateTagDto, {
      where: { id },
      returning: true,
    });

    return updatedTags[0];
  }

  public async delete(id: string): Promise<void> {
    const existingTag = await this.readOneBy({ id });
    if (!existingTag) {
      throw new NotFoundException(`tag with id=${id} not found`);
    }
    await this.tagRepository.destroy({ where: { id } });
  }
}

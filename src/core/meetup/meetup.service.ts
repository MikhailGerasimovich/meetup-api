import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { UpdateMeetupDto } from './dto/update-meetup.dto';
import { MeetupOptions } from './dto/meetup.options';
import { Meetup } from './meetup.model';
import { TagService } from '../tag/tag.service';
import { Tag } from '../tag/tag.model';
import { Transaction } from 'sequelize';
import { ReadAllResult } from 'src/common/read-all/types/read-all.types';
import { defaultPagination } from 'src/common/constants/pagination.constants';
import { IReadAllMeetupOptions } from './types/read-all-meetup.options';

@Injectable()
export class MeetupService {
  constructor(
    @InjectModel(Meetup) private readonly meetupRepository: typeof Meetup,
    private readonly tagService: TagService,
  ) {}

  public async create(createMeetupDto: CreateMeetupDto, transaction: Transaction): Promise<Meetup> {
    const { tags } = createMeetupDto;

    const meetup = await this.meetupRepository.create(createMeetupDto, {
      transaction,
    });

    const tagsArray = await this.getExistingOrCreateTags(tags, transaction);
    await meetup.$add('tags', tagsArray, { transaction });

    meetup.tags = tagsArray;

    return meetup;
  }

  public async readAll(readOptions: IReadAllMeetupOptions): Promise<ReadAllResult<Meetup>> {
    const pagination = readOptions.pagination ?? defaultPagination;

    const { count, rows } = await this.meetupRepository.findAndCountAll({
      include: { all: true },
      distinct: true,
      limit: pagination.size,
      offset: pagination.offset,
    });

    return {
      totalRecordsNumber: count,
      entities: rows,
    };
  }

  public async readOneBy(meetupOptions: MeetupOptions): Promise<Meetup> {
    const meetup = await this.meetupRepository.findOne({
      where: { ...meetupOptions },
      include: { all: true, through: { attributes: [] } },
    });
    return meetup;
  }

  public async update(
    id: string,
    updateMeetupDto: UpdateMeetupDto,
    transaction: Transaction,
  ): Promise<Meetup> {
    const existingMeetup = await this.readOneBy({ id });
    if (!existingMeetup) {
      throw new NotFoundException(`meetup with id=${id} not found`);
    }
    const { tags, ...updateMeetupData } = updateMeetupDto;

    const [nemberUpdatedRows, updatedMeetups] = await this.meetupRepository.update(
      updateMeetupData,
      {
        where: { id },
        returning: true,
        transaction,
      },
    );

    if (tags) {
      const tagsArray = await this.getExistingOrCreateTags(tags, transaction);
      await existingMeetup.$set('tags', tagsArray, { transaction });
      updatedMeetups[0].tags = tagsArray;
    } else {
      updatedMeetups[0].tags = existingMeetup.tags;
    }

    return updatedMeetups[0];
  }

  public async delete(id: string): Promise<void> {
    const existingModel = await this.readOneBy({ id });
    if (!existingModel) {
      throw new NotFoundException(`meetup with id=${id} not found`);
    }
    await this.meetupRepository.destroy({ where: { id } });
  }

  private async getExistingOrCreateTags(tags: string[], transaction?: Transaction): Promise<Tag[]> {
    const tagsArray = [];
    for await (const tag of tags) {
      const existingTag = await this.tagService.readOneBy({ name: tag });
      tagsArray.push(
        existingTag ? existingTag : await this.tagService.create({ name: tag }, transaction),
      );
    }
    return tagsArray;
  }
}

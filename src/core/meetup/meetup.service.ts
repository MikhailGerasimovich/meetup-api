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
import { IReadAllMeetupOptions, MeetupFiltration } from './types/read-all-meetup.options';
import { defaultSorting } from 'src/common/constants/sorting.constants';
import { PayloadDto } from '../auth/dto/payload.dto';
import { UserService } from '../user/user.service';
import { BadRequestException } from '@nestjs/common/exceptions';
import { User } from '../user/user.model';
import { Role } from '../role/role.model';

@Injectable()
export class MeetupService {
  constructor(
    @InjectModel(Meetup) private readonly meetupRepository: typeof Meetup,
    private readonly tagService: TagService,
    private readonly userService: UserService,
  ) {}

  public async create(
    createMeetupDto: CreateMeetupDto,
    user: PayloadDto,
    transaction: Transaction,
  ): Promise<Meetup> {
    const meetup = await this.meetupRepository.create(createMeetupDto, {
      transaction,
    });

    const { tags } = createMeetupDto;
    const tagsArray = await this.getExistingOrCreateTags(tags, transaction);
    await meetup.$add('tags', tagsArray, { transaction });

    const organizer = await this.userService.readOneBy({ id: user.id }, transaction);
    if (!organizer) {
      throw new BadRequestException(`you can't create a meetup without linking to a user`);
    }

    await meetup.$set('organizer', organizer, { transaction });

    meetup.tags = tagsArray;
    meetup.organizer = organizer;

    return meetup;
  }

  public async readAll(readOptions: IReadAllMeetupOptions): Promise<ReadAllResult<Meetup>> {
    const pagination = readOptions.pagination ?? defaultPagination;
    const sorting = readOptions.sorting ?? defaultSorting;
    const filter = MeetupFiltration.getLikeFilters(readOptions.filter);

    const { count, rows } = await this.meetupRepository.findAndCountAll({
      where: { ...filter.meetupFilters },
      include: [
        {
          model: Tag,
          where: { ...filter.tagsFilters },
          all: true,
        },
        {
          model: User,
          as: 'organizer',
        },
      ],
      distinct: true,
      limit: pagination.size,
      offset: pagination.offset,
      order: [[sorting.column, sorting.direction]],
    });

    for (let meetup of rows) {
      meetup.tags = await meetup.$get('tags');
    }

    return {
      totalRecordsNumber: count,
      entities: rows,
    };
  }

  public async readOneBy(meetupOptions: MeetupOptions): Promise<Meetup> {
    const meetup = await this.meetupRepository.findOne({
      where: { ...meetupOptions },
      include: [
        {
          model: Tag,
          all: true,
          through: { attributes: [] },
        },
        {
          model: User,
          as: 'organizer',
        },
      ],
    });

    return meetup;
  }

  public async readOneById(id: string): Promise<Meetup> {
    const meetup = await this.readOneBy({ id });
    if (!meetup) {
      throw new NotFoundException(`meetup with id=${id} not found`);
    }
    return meetup;
  }

  public async update(
    id: string,
    updateMeetupDto: UpdateMeetupDto,
    organizer: PayloadDto,
    transaction: Transaction,
  ): Promise<Meetup> {
    const existingMeetup = await this.readOneBy({ id });
    if (!existingMeetup) {
      throw new NotFoundException(`meetup with id=${id} not found`);
    }

    if (existingMeetup.organizer.id !== organizer.id) {
      throw new BadRequestException('you cannot perform this action');
    }

    const { tags, ...updateMeetupData } = updateMeetupDto;

    const [numberUpdatedRows, updatedMeetups] = await this.meetupRepository.update(
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

  public async delete(id: string, organizer: PayloadDto): Promise<void> {
    const existingMeetup = await this.readOneBy({ id });
    if (!existingMeetup) {
      throw new NotFoundException(`meetup with id=${id} not found`);
    }

    const isOrganizer = existingMeetup.organizer.id === organizer.id;
    const isAdmin = organizer.roles.some((role: Role) => role.name === 'ADMIN');

    if (!isOrganizer && !isAdmin) {
      throw new BadRequestException('you cannot perform this action');
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

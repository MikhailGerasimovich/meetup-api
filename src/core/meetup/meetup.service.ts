import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { UpdateMeetupDto } from './dto/update-meetup.dto';
import { MeetupOptions } from './dto/meetup.options';
import { Meetup } from './meetup.model';
import { TagService } from '../tag/tag.service';
import { Tag } from '../tag/tag.model';
import { Transaction } from 'sequelize';

@Injectable()
export class MeetupService {
  constructor(
    @InjectModel(Meetup) private readonly meetupRepository: typeof Meetup,
    private readonly tagService: TagService,
  ) {}

  public async create(createMeetupDto: CreateMeetupDto, transaction: Transaction): Promise<any> {
    const { tags } = createMeetupDto;

    const meetup = await this.meetupRepository.create(createMeetupDto, { transaction });

    const tagsArray = await this.getExistingOrCreateTags(tags, transaction);
    await meetup.$add('tags', tagsArray, { transaction });

    return { message: `Meetup with title=${createMeetupDto.title} successfully created` };
  }

  public async readAllBy(meetupOptins: MeetupOptions): Promise<Meetup[]> {
    const meetups = await this.meetupRepository.findAll({
      where: { ...meetupOptins },
      include: { all: true, through: { attributes: [] } },
    });
    return meetups;
  }

  public async readOneBy(meetupOptios: MeetupOptions): Promise<Meetup> {
    const meetup = await this.meetupRepository.findOne({
      where: { ...meetupOptios },
      include: { all: true, through: { attributes: [] } },
    });
    return meetup;
  }

  public async update(
    id: string,
    updateMeetupDto: UpdateMeetupDto,
    transaction: Transaction,
  ): Promise<any> {
    const existingMeetup = await this.readOneBy({ id });
    if (!existingMeetup) {
      throw new NotFoundException(`meetup with id=${id} not found`);
    }
    const { tags, ...updateMeetupData } = updateMeetupDto;

    await this.meetupRepository.update(updateMeetupData, { where: { id }, transaction });

    if (tags) {
      const tagsArray = await this.getExistingOrCreateTags(tags, transaction);
      await existingMeetup.$set('tags', tagsArray, { transaction });
    }

    return { message: `Meetup with id=${id} successfully updated` };
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

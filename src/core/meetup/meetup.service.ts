import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { UpdateMeetupDto } from './dto/update-meetup.dto';
import { MeetupOptions } from './dto/meetup.options';
import { Meetup } from './meetup.model';
import { TagService } from '../tag/tag.service';
import { Tag } from '../tag/tag.model';

@Injectable()
export class MeetupService {
  constructor(
    @InjectModel(Meetup) private readonly meetupRepository: typeof Meetup,
    private readonly tagService: TagService,
  ) {}

  public async create(createMeetupDto: CreateMeetupDto): Promise<Meetup> {
    const { tags } = createMeetupDto;

    const meetup = await this.meetupRepository.create(createMeetupDto);

    const tagsArray = await this.getExistingOrCreateTags(tags);
    await meetup.$add('tags', tagsArray);

    const createdMeetup = await this.readOneBy({ id: meetup.id });
    return createdMeetup;
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

  public async update(id: string, updateMeetupDto: UpdateMeetupDto): Promise<Meetup> {
    const existingMeetup = await this.readOneBy({ id });
    if (!existingMeetup) {
      throw new NotFoundException(`meetup with id=${id} not found`);
    }
    const { tags, ...updateMeetupData } = updateMeetupDto;

    await this.meetupRepository.update(updateMeetupData, { where: { id } });

    if (tags) {
      const tagsArray = await this.getExistingOrCreateTags(tags);
      await existingMeetup.$set('tags', tagsArray);
    }

    const updatedMeetup = await this.readOneBy({ id });
    return updatedMeetup;
  }

  public async delete(id: string): Promise<void> {
    const existingModel = await this.readOneBy({ id });
    if (!existingModel) {
      throw new NotFoundException(`meetup with id=${id} not found`);
    }
    await this.meetupRepository.destroy({ where: { id } });
  }

  private async getExistingOrCreateTags(tags: string[]): Promise<Tag[]> {
    const tagsArray = [];
    for await (const tag of tags) {
      const existingTag = await this.tagService.readOneBy({ name: tag });
      tagsArray.push(existingTag ? existingTag : await this.tagService.create({ name: tag }));
    }
    return tagsArray;
  }
}

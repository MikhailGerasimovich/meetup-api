import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { UpdateMeetupDto } from './dto/update-meetup.dto';
import { MeetupOptios } from './dto/meetup.options';
import { Meetup } from './meetup.model';

@Injectable()
export class MeetupService {
  constructor(@InjectModel(Meetup) private readonly meetupRepository: typeof Meetup) {}

  public async create(createMeetupDto: CreateMeetupDto): Promise<Meetup> {
    const existingMeetup = await this.readOneBy({ title: createMeetupDto.title });
    if (existingMeetup) {
      throw new BadRequestException(`meetup with title=${createMeetupDto.title} already exists`);
    }
    const meetup = await this.meetupRepository.create(createMeetupDto);
    return meetup;
  }

  public async readAllBy(meetupOptins: MeetupOptios): Promise<Meetup[]> {
    const meetups = await this.meetupRepository.findAll({ where: { ...meetupOptins } });
    return meetups;
  }

  public async readOneBy(meetupOptios: MeetupOptios): Promise<Meetup> {
    const meetup = await this.meetupRepository.findOne({ where: { ...meetupOptios } });
    return meetup;
  }

  public async update(id: string, updateMeetupDto: UpdateMeetupDto): Promise<Meetup> {
    const existingMeetup = await this.readOneBy({ id });
    if (!existingMeetup) {
      throw new NotFoundException(`meetup with id=${id} not found`);
    }

    await this.meetupRepository.update(updateMeetupDto, { where: { id } });

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
}

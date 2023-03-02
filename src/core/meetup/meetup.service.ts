import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { UpdateMeetupDto } from './dto/update-meetup.dto';
import { Meetup } from './meetup.model';

@Injectable()
export class MeetupService {
  constructor(@InjectModel(Meetup) private readonly meetupRepository: typeof Meetup) {}

  public async create(createMeetupDto: CreateMeetupDto): Promise<Meetup> {
    const meetup = await this.meetupRepository.create(createMeetupDto);
    return meetup;
  }

  public async readAll(): Promise<Meetup[]> {
    const meetups = await this.meetupRepository.findAll();
    return meetups;
  }

  public async readById(id: string): Promise<Meetup> {
    const meetup = await this.meetupRepository.findByPk(id);
    return meetup;
  }

  public async update(id: string, updateMeetupDto: UpdateMeetupDto): Promise<void> {
    await this.meetupRepository.update(updateMeetupDto, { where: { id } });
  }

  public async delete(id: string): Promise<void> {
    await this.meetupRepository.destroy({ where: { id } });
  }
}

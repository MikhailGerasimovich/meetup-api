import { Controller, Post, Get, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { MeetupService } from './meetup.service';
import { Meetup } from './meetup.model';
import { UpdateMeetupDto } from './dto/update-meetup.dto';

@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() createMeetupDtp: CreateMeetupDto): Promise<Meetup> {
    const meetup = await this.meetupService.create(createMeetupDtp);
    return meetup;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async readAll(): Promise<Meetup[]> {
    const meetups = await this.meetupService.readAllBy({});
    return meetups;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async readById(@Param('id') id: string): Promise<Meetup> {
    const meetup = await this.meetupService.readOneBy({ id });
    return meetup;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(@Param('id') id: string, @Body() updateMeetupDto: UpdateMeetupDto): Promise<Meetup> {
    const updatedMeetup = await this.meetupService.update(id, updateMeetupDto);
    return updatedMeetup;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string): Promise<void> {
    await this.meetupService.delete(id);
  }
}

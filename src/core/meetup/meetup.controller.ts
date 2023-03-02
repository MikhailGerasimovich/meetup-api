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
    const meetups = await this.meetupService.readAll();
    return meetups;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async readById(@Param('id') id: string): Promise<Meetup> {
    const meetup = await this.meetupService.readById(id);
    return meetup;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(@Param('id') id: string, @Body() updateMeetupDto: UpdateMeetupDto): Promise<string> {
    await this.meetupService.update(id, updateMeetupDto);
    return 'updated';
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string): Promise<string> {
    await this.meetupService.delete(id);
    return 'deleted';
  }
}

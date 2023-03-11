import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { MeetupService } from './meetup.service';
import { UpdateMeetupDto } from './dto/update-meetup.dto';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { TransactionParam } from 'src/common/decorators/transaction.decorator';
import { FrontendMeetup } from './types/meetup.types';

@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @UseInterceptors(TransactionInterceptor)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createMeetupDtp: CreateMeetupDto,
    @TransactionParam() transaction: Transaction,
  ): Promise<FrontendMeetup> {
    const meetup = await this.meetupService.create(createMeetupDtp, transaction);
    return new FrontendMeetup(meetup);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async readAll(): Promise<FrontendMeetup[]> {
    const meetups = await this.meetupService.readAllBy({});
    return meetups.map((meetup) => new FrontendMeetup(meetup));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async readById(@Param('id') id: string): Promise<FrontendMeetup> {
    const meetup = await this.meetupService.readOneBy({ id });
    return new FrontendMeetup(meetup);
  }

  @UseInterceptors(TransactionInterceptor)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') id: string,
    @Body() updateMeetupDto: UpdateMeetupDto,
    @TransactionParam() transaction: Transaction,
  ): Promise<FrontendMeetup> {
    const updatedMeetup = await this.meetupService.update(id, updateMeetupDto, transaction);
    return new FrontendMeetup(updatedMeetup);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string): Promise<void> {
    await this.meetupService.delete(id);
  }
}

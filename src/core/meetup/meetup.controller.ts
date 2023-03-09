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
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { MeetupService } from './meetup.service';
import { Meetup } from './meetup.model';
import { UpdateMeetupDto } from './dto/update-meetup.dto';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { TransactionParam } from 'src/common/decorators/transaction.decorator';
import { Transaction } from 'sequelize';

@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @UseInterceptors(TransactionInterceptor)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createMeetupDtp: CreateMeetupDto,
    @TransactionParam() transaction: Transaction,
  ): Promise<any> {
    return await this.meetupService.create(createMeetupDtp, transaction);
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

  @UseInterceptors(TransactionInterceptor)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') id: string,
    @Body() updateMeetupDto: UpdateMeetupDto,
    @TransactionParam() transaction: Transaction,
  ): Promise<any> {
    return await this.meetupService.update(id, updateMeetupDto, transaction);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string): Promise<void> {
    await this.meetupService.delete(id);
  }
}

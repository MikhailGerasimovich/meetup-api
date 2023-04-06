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
  Query,
  UseGuards,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { MeetupService } from './meetup.service';
import { UpdateMeetupDto } from './dto/update-meetup.dto';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { TransactionParam } from 'src/common/decorators/transaction.decorator';
import { FrontendMeetup } from './types/meetup.types';
import { ReadAllMeetupDto } from './dto/read-all-meetup.dto';
import { Meetup } from './meetup.model';
import { ReadAllResult } from 'src/common/read-all/types/read-all.types';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserFromRequest } from 'src/common/decorators/user-from-request.decorator';
import { PayloadDto } from '../auth/dto/payload.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @UseInterceptors(TransactionInterceptor)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createMeetupDto: CreateMeetupDto,
    @TransactionParam() transaction: Transaction,
    @UserFromRequest() user: PayloadDto,
  ): Promise<FrontendMeetup> {
    const meetup = await this.meetupService.create(createMeetupDto, user, transaction);
    return new FrontendMeetup(meetup);
  }

  @Post('join/:id')
  @HttpCode(HttpStatus.CREATED)
  public async joinToMeetup(
    @Param('id') id: string,
    @UserFromRequest() member: PayloadDto,
  ): Promise<FrontendMeetup> {
    const meetup = await this.meetupService.joinToMeetup(id, member);
    return new FrontendMeetup(meetup);
  }

  @Post('leave/:id')
  @HttpCode(HttpStatus.CREATED)
  public async leaveFromMeetup(
    @Param('id') id: string,
    @UserFromRequest() member: PayloadDto,
  ): Promise<FrontendMeetup> {
    const meetup = await this.meetupService.leavefromMeetup(id, member);
    return new FrontendMeetup(meetup);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async readAll(
    @Query() readAllMeetupDto: ReadAllMeetupDto,
  ): Promise<ReadAllResult<FrontendMeetup>> {
    const { pagination, sorting, ...filter } = readAllMeetupDto;

    const meetups = await this.meetupService.readAll({ pagination, sorting, filter });
    return {
      totalRecordsNumber: meetups.totalRecordsNumber,
      entities: meetups.entities.map((meetup: Meetup) => new FrontendMeetup(meetup)),
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async readById(@Param('id') id: string): Promise<FrontendMeetup> {
    const meetup = await this.meetupService.readOneById(id);
    return new FrontendMeetup(meetup);
  }

  @UseInterceptors(TransactionInterceptor)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') id: string,
    @Body() updateMeetupDto: UpdateMeetupDto,
    @TransactionParam() transaction: Transaction,
    @UserFromRequest() organizer: PayloadDto,
  ): Promise<FrontendMeetup> {
    const updatedMeetup = await this.meetupService.update(
      id,
      updateMeetupDto,
      organizer,
      transaction,
    );
    return new FrontendMeetup(updatedMeetup);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param('id') id: string,
    @UserFromRequest() organizer: PayloadDto,
  ): Promise<void> {
    await this.meetupService.delete(id, organizer);
  }
}

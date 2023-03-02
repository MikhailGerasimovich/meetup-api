import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MeetupController } from './meetup.controller';
import { Meetup } from './meetup.model';
import { MeetupService } from './meetup.service';

@Module({
  imports: [SequelizeModule.forFeature([Meetup])],
  controllers: [MeetupController],
  providers: [MeetupService],
})
export class MeetupModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Meetup } from './meetup.model';

@Module({
  imports: [SequelizeModule.forFeature([Meetup])],
})
export class MeetupModule {}

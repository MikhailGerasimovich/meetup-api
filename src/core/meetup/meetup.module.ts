import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { TagModule } from '../tag/tag.module';
import { MeetupController } from './meetup.controller';
import { Meetup } from './meetup.model';
import { MeetupService } from './meetup.service';

@Module({
  imports: [SequelizeModule.forFeature([Meetup]), TagModule],
  controllers: [MeetupController],
  providers: [
    MeetupService,
    TransactionInterceptor,
    { provide: 'SEQUELIZE', useExisting: Sequelize },
  ],
})
export class MeetupModule {}

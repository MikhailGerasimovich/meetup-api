import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { TagController } from './tag.controller';
import { Tag } from './tag.model';
import { TagService } from './tag.service';

@Module({
  imports: [SequelizeModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [TagService, TransactionInterceptor, { provide: 'SEQUELIZE', useExisting: Sequelize }],
  exports: [TagService],
})
export class TagModule {}

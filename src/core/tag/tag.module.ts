import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tag } from './tag.model';

@Module({
  imports: [SequelizeModule.forFeature([Tag])],
})
export class TagModule {}

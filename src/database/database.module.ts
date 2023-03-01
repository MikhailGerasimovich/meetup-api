import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { dbconfig } from 'src/configs/db.config';

@Module({
  imports: [SequelizeModule.forRoot(dbconfig)],
})
export class DatabaseModule {}

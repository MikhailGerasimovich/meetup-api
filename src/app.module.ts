import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { CoreModule } from './core/core.module';
import { TagModule } from './core/tag/tag.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, CoreModule, TagModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}

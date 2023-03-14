import { Module } from '@nestjs/common';
import { MeetupModule } from './meetup/meetup.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [MeetupModule, TagModule],
})
export class CoreModule {}

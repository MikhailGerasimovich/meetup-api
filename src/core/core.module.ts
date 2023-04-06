import { Module } from '@nestjs/common';
import { MeetupModule } from './meetup/meetup.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MeetupModule, TagModule, UserModule, RoleModule, AuthModule],
})
export class CoreModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { RoleModule } from '../role/role.module';
import { UserController } from './user.controller';
import { User } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([User]), RoleModule],
  controllers: [UserController],
  providers: [
    UserService,
    TransactionInterceptor,
    { provide: 'SEQUELIZE', useExisting: Sequelize },
  ],
  exports: [UserService],
})
export class UserModule {}

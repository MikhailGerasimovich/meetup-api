import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { RoleController } from './role.controller';
import { Role } from './role.model';
import { RoleService } from './role.service';

@Module({
  imports: [SequelizeModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [
    RoleService,
    TransactionInterceptor,
    { provide: 'SEQUELIZE', useExisting: Sequelize },
  ],
  exports: [RoleService],
})
export class RoleModule {}

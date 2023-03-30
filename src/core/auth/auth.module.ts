import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport/dist';
import { Sequelize } from 'sequelize-typescript';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_DURATION },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    TransactionInterceptor,
    { provide: 'SEQUELIZE', useExisting: Sequelize },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

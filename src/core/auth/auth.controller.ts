import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { TransactionParam } from 'src/common/decorators/transaction.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from 'src/common/guards/local.guard';
import { FrontendUser } from '../user/types/user.types';
import { RefreshDto } from './dto/refresh.dto';
import { FrontendJwt } from './types/jwt.types';
import { UserFromRequest } from 'src/common/decorators/user-from-request.decorator';
import { User } from '../user/user.model';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RefreshGuard } from 'src/common/guards/refresh.guard';
import { PayloadDto } from './dto/payload.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(TransactionInterceptor)
  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  public async registration(
    @Body() createUserDto: CreateUserDto,
    @TransactionParam() transaction: Transaction,
  ): Promise<FrontendUser> {
    const registeredUser = await this.authService.registration(createUserDto, transaction);
    return new FrontendUser(registeredUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@UserFromRequest() user: User, @Req() req: Request): Promise<FrontendJwt> {
    const tokens = await this.authService.login(user);
    req.res.cookie('auth-cookie', tokens, { httpOnly: true });
    return tokens;
  }

  @UseGuards(RefreshGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(@UserFromRequest() user: User, @Req() req): Promise<FrontendJwt> {
    const tokens = await this.authService.refresh(user);
    req.res.cookie('auth-cookie', tokens, { httpOnly: true });
    return tokens;
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  public async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @UserFromRequest() userData: PayloadDto,
  ): Promise<FrontendUser> {
    const user = await this.authService.changePassword(changePasswordDto, userData);
    return new FrontendUser(user);
  }
}

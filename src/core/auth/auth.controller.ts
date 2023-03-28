import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseGuards,
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
  public async login(@UserFromRequest() user): Promise<FrontendJwt> {
    const tokens = await this.authService.login(user);
    return tokens;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(@Body() refreshDto: RefreshDto): Promise<FrontendJwt> {
    const tokens = await this.authService.refresh(refreshDto.refreshToken);
    return tokens;
  }
}

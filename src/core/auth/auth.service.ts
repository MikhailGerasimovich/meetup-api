import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { UserService } from '../user/user.service';
import { hashSync, compareSync, hash } from 'bcryptjs';
import { User } from '../user/user.model';
import { JwtService } from '@nestjs/jwt';
import { PayloadDto } from './dto/payload.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  //наверно так себе идея возвращать после регистрации пользователя, а может и норм
  public async registration(createUserDto: CreateUserDto, transaction: Transaction): Promise<User> {
    const hashPassword = await hash(createUserDto.password, 7);
    const registratedUser = await this.userService.create(
      {
        ...createUserDto,
        password: hashPassword,
      },
      transaction,
    );
    return registratedUser;
  }

  public async login(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { id: user.id, roles: user.roles } as PayloadDto;

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_DURATION,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_DURATION,
    });

    return { accessToken, refreshToken };
  }

  public async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!refreshToken) {
      throw new BadRequestException('no refresh token');
    }
    try {
      const { id, roles } = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      const payload = { id, roles } as PayloadDto;

      const newAccessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.JWT_ACCESS_TOKEN_DURATION,
      });

      const newRefreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.JWT_REFRESH_TOKEN_DURATION,
      });
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('refresh token expired');
      } else {
        throw new BadRequestException('refresh token is invalid');
      }
    }
  }

  public async validateUser(login: string, password: string): Promise<User | null> {
    const candidate = await this.userService.readOneBy({ login });
    if (!candidate) {
      throw new NotFoundException(`user with login=${login} doesn't exists`);
    }

    if (candidate && compareSync(password, candidate.password)) {
      return candidate;
    }

    return null;
  }
}

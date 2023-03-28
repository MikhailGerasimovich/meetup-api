import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { UserService } from '../user/user.service';
import { compareSync, hash } from 'bcryptjs';
import { User } from '../user/user.model';
import { JwtService } from '@nestjs/jwt';
import { PayloadDto } from './dto/payload.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { FrontendJwt } from './types/jwt.types';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

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

  public async login(user: User): Promise<FrontendJwt> {
    const payload = { id: user.id, roles: user.roles };

    const accessToken = await this.generateAccessJwtToken(payload);
    const refreshToken = await this.generateRefreshJwtToken(payload);

    return { accessToken, refreshToken };
  }

  public async refresh(refreshToken: string): Promise<FrontendJwt> {
    if (!refreshToken) {
      throw new BadRequestException('no refresh token');
    }
    try {
      const { id, roles } = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      const payload = { id, roles };
      const newAccessToken = await this.generateAccessJwtToken(payload);
      const newRefreshToken = await this.generateRefreshJwtToken(payload);

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

  private async generateAccessJwtToken(payload: PayloadDto): Promise<string> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_DURATION,
    });

    return accessToken;
  }

  private async generateRefreshJwtToken(payload: PayloadDto): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_DURATION,
    });

    return refreshToken;
  }
}

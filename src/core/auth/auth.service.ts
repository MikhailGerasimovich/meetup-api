import { Injectable, BadRequestException } from '@nestjs/common';
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

  public async validateUser(login: string, password: string): Promise<User> {
    const candidate = await this.userService.readOneBy({ login });
    if (candidate && compareSync(password, candidate.password)) {
      return candidate;
    }

    throw new BadRequestException('wrong login or password');
  }

  public async registration(createUserDto: CreateUserDto, transaction: Transaction): Promise<User> {
    const hashPassword = await hash(createUserDto.password, 10);
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

    const accessToken = await this.generateAccessJwt(payload);
    const refreshToken = await this.generateRefreshJwt(payload);

    return { accessToken, refreshToken };
  }

  public async refresh(user: User): Promise<FrontendJwt> {
    const payload = { id: user.id, roles: user.roles };
    const newAccessToken = await this.generateAccessJwt(payload);
    const newRefreshToken = await this.generateRefreshJwt(payload);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  private async generateAccessJwt(payload: PayloadDto): Promise<string> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_DURATION,
    });

    return accessToken;
  }

  private async generateRefreshJwt(payload: PayloadDto): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_DURATION,
    });

    return refreshToken;
  }
}

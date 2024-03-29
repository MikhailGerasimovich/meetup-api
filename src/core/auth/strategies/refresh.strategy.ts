import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/core/user/user.service';
import { PayloadDto } from '../dto/payload.dto';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const data = request?.cookies['auth-cookie'];
          if (!data) {
            return null;
          }
          return data.refreshToken;
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  async validate(payload: PayloadDto) {
    if (!payload) {
      throw new BadRequestException('missing refresh jwt');
    }
    const user = await this.userService.readOneBy({ id: payload.id });
    return user;
  }
}

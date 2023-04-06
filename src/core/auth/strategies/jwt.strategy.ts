import { Injectable } from '@nestjs/common/decorators';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadDto } from '../dto/payload.dto';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          let data = request?.cookies['auth-cookie'];
          if (!data) {
            return null;
          }
          return data.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  public async validate(payload: PayloadDto) {
    if (!payload) {
      throw new UnauthorizedException('missing access jwt');
    }
    return payload;
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import modifyStringWithValues from '../../helpers/modifyStringWithValues';
import { validations } from '../../constants';
const { invalidItem } = validations;
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_ACCESS_SECRET') as string;

    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    };

    super(options);
  }

  validate(payload: { userId }) {
    if (!payload?.userId) {
      throw new UnauthorizedException(
        modifyStringWithValues(invalidItem, {
          item: 'Token payload',
        }),
      );
    }
    return { userId: payload.userId};
  }
}

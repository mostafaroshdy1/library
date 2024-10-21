import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from 'src/common/config/App.Config';

@Injectable()
export class AccessStrategy extends PassportStrategy(
  Strategy,
  'AccessStrategy',
) {
  constructor(AppConfig: AppConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AppConfig.config.Auth.jwtAccessSecret,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}

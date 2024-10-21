import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from 'src/common/config/App.Config';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'RefreshStrategy',
) {
  constructor(AppConfig: AppConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AppConfig.config.Auth.jwtRefreshSecret,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}

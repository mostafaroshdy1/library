import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from 'src/common/config/App.Config';
import { UserModels } from 'src/models/user.models';

@Injectable()
export class JwtSignService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly AppConfig: AppConfig,
  ) {}

  accessTokenSign(payload: UserModels.CurrentUser): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.AppConfig.config.Auth.jwtAccessSecret,
      expiresIn: this.AppConfig.config.Auth.jwtAccessLifespan,
    });
  }

  refreshTokenSign(payload: UserModels.CurrentUser): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.AppConfig.config.Auth.jwtRefreshSecret,
      expiresIn: this.AppConfig.config.Auth.jwtRefreshLifespan,
    });
  }

  verifyRefreshToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}

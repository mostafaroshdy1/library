import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user.module';
import { CommonModule } from './common.module';
import { AuthService } from 'src/services/auth.service';
import { JwtSignService } from 'src/services/JwtSign.Service';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { AccessStrategy } from 'src/auth/strategies/access.strategy';
import { RefreshStrategy } from 'src/auth/strategies/refresh.strategy';
import { AuthController } from 'src/controllers/auth.controller';
import { RepositoryModule } from './repository.module';

@Module({
  imports: [PassportModule, UserModule, CommonModule, RepositoryModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtSignService,
    JwtService,
    LocalStrategy,
    AccessStrategy,
    RefreshStrategy,
  ],
})
export class AuthModule {}

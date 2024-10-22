import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from './common/interceptors/currentUser.interceptor';
import { CommonModule } from './modules/common.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),

    UserModule,
    AuthModule,
    CommonModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 50,
      },
    ]),
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

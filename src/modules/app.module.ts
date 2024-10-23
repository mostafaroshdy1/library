import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import configuration from 'src/common/config/configuration';
import { CurrentUserInterceptor } from 'src/common/interceptors/currentUser.interceptor';
import { AuthModule } from 'src/modules/auth.module';
import { BookModule } from 'src/modules/book.module';
import { CommonModule } from 'src/modules/common.module';
import { UserModule } from 'src/modules/user.module';

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
    BookModule,
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

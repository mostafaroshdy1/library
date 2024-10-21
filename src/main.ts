import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppConfig } from './common/config/App.Config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const appConfig = app.get(AppConfig);
  const port = appConfig.config.Host.port;

  app
    .listen({
      port,
    })
    .then(() => {
      console.log(`Server is running on port ${port}`);
    });
}
bootstrap();
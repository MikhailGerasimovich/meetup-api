import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as coocieParser from 'cookie-parser';
import { config } from 'dotenv';
config();

const port = Number(process.env.PORT) ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(coocieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(port);
}
bootstrap();

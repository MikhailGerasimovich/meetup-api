import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as coocieParser from 'cookie-parser';
import { config } from 'dotenv';
config();

// const port = Number(process.env.PORT) ?? 3000;
// const host = process.env.HOST ?? 'localhost';

const address = process.env.ADDRESS;

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
  await app.listen(address);
}
bootstrap();

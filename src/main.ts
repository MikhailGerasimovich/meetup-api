import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
config();

const port = Number(process.env.PORT) ?? 3000;
const host = process.env.HOST ?? 'localhost';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port, host);
}
bootstrap();

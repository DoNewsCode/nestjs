/**
 * Created by Rain on 2020/7/17
 */
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3001);
}

bootstrap();

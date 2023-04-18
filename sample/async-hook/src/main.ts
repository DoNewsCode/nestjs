/**
 * Created by Rain on 2020/7/17
 */
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { grpcClientOptions } from './grpc.controller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(grpcClientOptions);
  await app.startAllMicroservices();
  await app.listen(3001);
}

bootstrap();

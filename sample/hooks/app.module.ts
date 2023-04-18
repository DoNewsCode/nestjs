/**
 * Created by Rain on 2020/7/17
 */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import {
  AsyncHooksMiddleware,
  AsyncHooksModule,
} from '@donews/nestjs-tracing/';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbService, GrpcService } from './service';

@Module({
  imports: [AsyncHooksModule],
  providers: [DbService, GrpcService, AppService],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AsyncHooksMiddleware).forRoutes(AppController);
  }
}

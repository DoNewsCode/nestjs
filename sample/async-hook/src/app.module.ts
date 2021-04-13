/**
 * Created by Rain on 2020/7/17
 */
import { Global, Module } from '@nestjs/common';
import { TracingConfig } from 'jaeger-client';

import { TracingModule, TracingModuleOptions } from '@donews/nestjs-tracing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GrpcController } from './grpc.controller';
import { RawGrpcProvider } from './proto/raw.service';
import { DbService } from './service/db.service';
import { GrpcService } from './service/grpc.service';


const config: TracingConfig = {
  serviceName: 'nest-async-hook-server',
  sampler: {
    param: 1,
    type: 'const',
  },
};
const options = {
  tags: {
    server2: '1.1.2',
  },
};

@Global()
@Module({
  imports: [
    // TracingModule.forRoot({ tracingConfig: config, tracingOption: options }),
    TracingModule.forRootAsync({
      useFactory(option: any) {
        return {
          tracingConfig: option.tracingConfig,
          tracingOption: option.tracingOption,
        } as TracingModuleOptions;
      },
      inject: ['configProvider'],
    }),
  ],
  providers: [
    {
      provide: 'configProvider',
      useValue: {
        tracingConfig: {
          serviceName: 'async-module-nest-async-hook-server',
          sampler: {
            param: 1,
            type: 'const',
          },
        },
        traceOption: {
          tags: {
            server2: '1.1.2',
          },
        },
      },
    },
    RawGrpcProvider,
    DbService,
    GrpcService,
    AppService,
  ],
  controllers: [AppController, GrpcController],
  exports: ['configProvider'],
})
export class AppModule {}

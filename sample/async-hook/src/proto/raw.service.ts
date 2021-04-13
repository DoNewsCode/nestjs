import { join } from 'path';

import { FactoryProvider } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CallOptions, credentials, Metadata } from 'grpc';
import { Observable } from 'rxjs';

import { tracingGrpcInterceptor } from '@donews/nestjs-tracing';

export interface RawService {
  say(
    request: { message: string },
    meta?: Metadata,
    callOptions?: CallOptions,
  ): Observable<{ data: string }>;
}

/**
 * Created by Rain on 2020/7/21
 */
export const RawGrpcProvider: FactoryProvider = {
  provide: 'RAW_SERVICE',
  useFactory: () => {
    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:4001',
        credentials: credentials.createInsecure(),
        package: 'rawpackage',
        protoPath: join(__dirname, './raw.proto'),
        channelOptions: {
          interceptors: [tracingGrpcInterceptor] as any,
        },
      },
    });
  },
};

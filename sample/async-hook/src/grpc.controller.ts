/**
 * Created by Rain on 2020/7/21
 */
import { join } from 'path';

import { Controller } from '@nestjs/common';
import { ClientOptions, GrpcMethod, Transport } from '@nestjs/microservices';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:4001',
    package: 'rawpackage',
    protoPath: join(__dirname, './proto/raw.proto'),
  },
};

@Controller()
export class GrpcController {
  @GrpcMethod('RawService', 'Say')
  async say(
    data: { message: string },
    metadata: Record<any, any>,
  ): Promise<{ data: string }> {
    await sleep(Math.random() * 1000);
    return { data: 'tes' };
  }
}

export function sleep(time: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

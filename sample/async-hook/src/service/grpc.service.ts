/**
 * created at by Rain 2020/7/18
 */
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from 'grpc';

import { SpanD } from '@donews/nestjs-tracing';
import { RawService } from '../proto/raw.service';

@Injectable()
export class GrpcService {
  constructor(@Inject('RAW_SERVICE') private readonly client: ClientGrpc) {}

  @SpanD('GrpcService.getService')
  async getService(): Promise<{ data: string }> {
    const rawService = this.client.getService<RawService>('RawService');
    return await rawService.say({ message: 'tse' }, new Metadata()).toPromise();
  }
}

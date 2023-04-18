/**
 * created at by Rain 2020/7/18
 */
import { Injectable } from '@nestjs/common';

import { AsyncContext } from '@donews/nestjs-tracing';

import { DbService, GrpcService } from './service';

@Injectable()
export class AppService {
  constructor(
    private readonly dbService: DbService,
    private readonly grpcService: GrpcService,
    private readonly asyncContext: AsyncContext,
  ) {}

  async get(): Promise<any> {
    const context = this.asyncContext.get('tracing');
    context.service = 'get';
    this.asyncContext.set('tracing', context);

    const dbService = await this.dbService.find();
    const grpcService = await this.grpcService.getService();

    return { dbService, grpcService, test: this.asyncContext.get('tracing') };
  }
}

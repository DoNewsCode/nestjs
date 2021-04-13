/**
 * created at by Rain 2020/7/18
 */
import { Injectable } from '@nestjs/common';

import { AsyncContext } from '../../../packages/nestjs-tracing/lib/hook';

@Injectable()
export class DbService {
  constructor(private readonly asyncContext: AsyncContext) {}

  find(): Promise<number> {
    return new Promise((resolve) => {
      const context = this.asyncContext.get('tracing');
      context.dbService = 'find';
      this.asyncContext.set('tracing', context);

      const randomTime = 1000 * Math.random();
      setTimeout(() => {
        resolve(randomTime);
      }, randomTime);
    });
  }
}

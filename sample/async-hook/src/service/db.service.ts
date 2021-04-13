/**
 * created at by Rain 2020/7/18
 */
import { Injectable } from '@nestjs/common';

import { SpanD } from '@donews/nestjs-tracing';

@Injectable()
export class DbService {
  @SpanD('dbService.find')
  find(): Promise<number> {
    return new Promise((resolve) => {
      const randomTime = 1000 * Math.random();
      setTimeout(() => {
        resolve(randomTime);
      }, randomTime);
    });
  }
}

/**
 * Created by Rain on 2020/7/20
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { AsyncContext } from './async-context';

@Injectable()
export class AsyncHooksMiddleware implements NestMiddleware {
  constructor(private readonly asyncContext: AsyncContext) {}

  use(req: Request, res: Response, next: () => void): void {
    this.asyncContext.run(next);
  }
}

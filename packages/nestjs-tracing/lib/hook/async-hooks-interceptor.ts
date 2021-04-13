/**
 * Created by Rain on 2020/7/21
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { AsyncContext } from './async-context';

@Injectable()
export class AsyncHooksInterceptor implements NestInterceptor {
  constructor(private readonly asyncContext: AsyncContext) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return this.asyncContext.run(() => next.handle());
  }
}

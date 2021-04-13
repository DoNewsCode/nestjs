/**
 * Created by Rain on 2020/7/20
 */
import { Global, Module } from '@nestjs/common';

import { AsyncContext } from './async-context';

@Global()
@Module({
  providers: [
    {
      provide: AsyncContext,
      useValue: AsyncContext.getInstance(),
    },
  ],
  exports: [AsyncContext],
})
export class AsyncHooksModule {}

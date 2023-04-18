/**
 * Created by Rain on 2020/7/21
 */
import { InterceptingCall, Listener, Metadata, Requester } from '@grpc/grpc-js';

import { TRACER_CARRIER_INFO } from '../constant';
import { AsyncContext } from '../hook';

export function tracingGrpcInterceptor(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  options: any,
  nextCall: (...args: any) => any,
): InterceptingCall {
  const request: Requester = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    start(metadata: Metadata, listener: Listener, next: Function): void {
      const carrier = AsyncContext.getInstance().get(TRACER_CARRIER_INFO);
      for (const key of Object.keys(carrier)) {
        metadata.add(key, carrier[key]);
      }
      next(metadata, listener);
    },
  };
  return new InterceptingCall(nextCall(options), request);
}

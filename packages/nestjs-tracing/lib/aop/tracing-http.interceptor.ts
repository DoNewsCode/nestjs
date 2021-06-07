import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  FORMAT_HTTP_HEADERS,
  FORMAT_TEXT_MAP,
  Span,
  SpanContext,
  Tags,
  Tracer,
} from 'opentracing';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import {
  TRACER,
  TRACER_BAGGAGE_HEADER_PREFIX,
  TRACER_CARRIER_INFO,
  TRACER_STATE_HEADER_NAME,
  TRACING_MODULE_OPTIONS,
} from '../constant';
import { AsyncContext } from '../hook';
import { TracingModuleOptions } from '../interface/tracing.interface';
import { isSpanContext } from '../util/span.util';

/**
 * Created by Rain on 2020/7/21
 */
@Injectable()
export class TracingHttpInterceptor implements NestInterceptor {
  constructor(
    private readonly asyncContext: AsyncContext,
    @Inject(TRACER) private readonly tracer: Tracer,
    @Inject(TRACING_MODULE_OPTIONS)
    private readonly tracingModuleOptions: TracingModuleOptions,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const response: Response = context.switchToHttp().getResponse<Response>();
    const handler = context.getHandler().name;
    const controller = context.getClass().name;

    const tracingContext = this.getTracingContext(request);

    const carrier: any = tracingContext?.carrier ? tracingContext.carrier : {};

    let span: Span;
    if (tracingContext?.spanContext) {
      span = this.tracer.startSpan(`${controller}.${handler}`, {
        childOf: tracingContext.spanContext,
      });
    } else {
      span = this.tracer.startSpan(`${controller}.${handler}`);
    }

    return this.asyncContext.run(() => {
      this.tracer.inject(span, FORMAT_TEXT_MAP, carrier);
      this.asyncContext.set(TRACER_CARRIER_INFO, carrier);

      span.setTag('path', request.path);
      span.setTag('method', request.method);
      span.log({ url: request.url });

      return next.handle().pipe(
        tap(() => {
          span.finish();
        }),
        catchError((error: any) => {
          span.setTag(Tags.ERROR, true);
          span.log({
            'err.stack': error.stack,
            statusCode: response.statusCode,
          });
          span.finish();
          return throwError(error);
        }),
      );
    });
  }

  private getTracingContext(
    req: Request,
  ): null | { carrier: any; spanContext: SpanContext } {
    const carrier = this.getTracingCarrier([req.headers, req.query]);
    const spanContext = this.tracer.extract(FORMAT_HTTP_HEADERS, carrier);

    if (isSpanContext(spanContext)) {
      return { carrier, spanContext };
    }
    return null;
  }

  getTracingCarrier(carrierList: Record<string, any>[]): Record<string, any> {
    const carrierEnd: Record<string, any> = {};

    const { tracingOption } = this.tracingModuleOptions;

    const contextKey = tracingOption?.contextKey ?? TRACER_STATE_HEADER_NAME;
    const baggagePrefix =
      tracingOption?.baggagePrefix ?? TRACER_BAGGAGE_HEADER_PREFIX;

    for (const carrier of carrierList) {
      const keys = Object.keys(carrier);
      for (const key of keys) {
        const lowKey = key.toLowerCase();
        if (lowKey === contextKey) {
          carrierEnd[key] = carrier[key];
        }
        if (lowKey.startsWith(baggagePrefix)) {
          carrierEnd[key] = carrier[key];
        }
      }
    }

    return carrierEnd;
  }
}

import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { FORMAT_HTTP_HEADERS, FORMAT_TEXT_MAP, Span, Tags } from 'opentracing';

import { TRACER_CARRIER_INFO } from './constant';
import { AsyncContext } from './hook';
import { TracingModule } from './tracing.module';

/**
 * Created by Rain on 2020/7/21
 */
export class HttpServiceInterceptors {
  static interceptRequest(): any {
    return [
      (config: AxiosRequestConfig): AxiosRequestConfig => {
        const tracer = TracingModule.tracer;

        const asyncContext = AsyncContext.getInstance();
        try {
          let context = asyncContext.get(TRACER_CARRIER_INFO);
          if (!context) {
            context = {};
            asyncContext.set(TRACER_CARRIER_INFO, context);
          }

          const ctx = tracer.extract(FORMAT_TEXT_MAP, context);

          let span: Span;
          if (ctx) {
            span = tracer.startSpan('http', { childOf: ctx });
          } else {
            span = tracer.startSpan('http');
          }
          span.addTags({ url: config.url, method: config.method });

          tracer.inject(span, FORMAT_HTTP_HEADERS, config.headers);

          const spanConfig: any = config;
          spanConfig.span = span;
          return spanConfig as AxiosRequestConfig;
        } catch (err) {
          return config;
        }
      },
      (error: any): Promise<any> => Promise.reject(error),
    ];
  }

  static interceptResponse(): any {
    return [
      (response: AxiosResponse): any => {
        const config = response.config as AxiosRequestConfig & { span: Span };
        if (config?.span) {
          config.span.log({
            result: response.data,
            statusCode: response.status,
          });
          config.span.finish();
        }
        return response;
      },
      (error: any): Promise<any> => {
        const config = error.config as AxiosRequestConfig & { span: Span };
        if (config?.span) {
          config.span.log({
            result: error.response?.data,
            statusCode: error.response?.status,
          });
          config.span.setTag(Tags.ERROR, true);
          config.span.finish();
        }
        return Promise.reject(error);
      },
    ];
  }
}

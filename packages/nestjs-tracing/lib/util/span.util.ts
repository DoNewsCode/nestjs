import SpanContext from 'opentracing/src/span_context';

/**
 * Created by Rain on 2020/7/21
 */
export function isSpanContext(span: SpanContext | null): span is SpanContext {
  return span && (span as any).isValid;
}

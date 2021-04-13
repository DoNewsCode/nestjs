/**
 * Created by Rain on 2020/7/20
 */
export const TRACING_MODULE_OPTIONS = Symbol('TRACING_MODULE_OPTIONS');

export const TRACER = Symbol('tracerProvider');

// execute stack 存储信息载体
export const TRACER_CARRIER_INFO = Symbol('tracingInfo');

// TRACER_BAGGAGE_HEADER_PREFIX is the default prefix used for saving baggage to a carrier.
export const TRACER_BAGGAGE_HEADER_PREFIX = 'uberctx-';

// TRACER_STATE_HEADER_NAME is the header key used for a span's serialized context.
export const TRACER_STATE_HEADER_NAME = 'uber-trace-id';

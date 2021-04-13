/**
 * Created by Rain on 2020/6/19
 */
import {
  Counter,
  CounterConfiguration,
  Gauge,
  GaugeConfiguration,
  Histogram,
  HistogramConfiguration,
  Metric,
  Summary,
  SummaryConfiguration,
} from 'prom-client';

const metricMetadataKey = Symbol('metrics parameter metadata key');

export function Counter1<T extends string>(
  config: CounterConfiguration<T>,
): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const metricList: { index: number; metric: Metric<T> }[] =
      Reflect.getOwnMetadata(metricMetadataKey, target, propertyKey) || [];
    metricList.push({ index: parameterIndex, metric: new Counter(config) });

    Reflect.defineMetadata(metricMetadataKey, metricList, target, propertyKey);
  };
}

export function Gauge1<T extends string>(
  config: GaugeConfiguration<T>,
): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const metricList: { index: number; metric: Metric<T> }[] =
      Reflect.getOwnMetadata(metricMetadataKey, target, propertyKey) || [];
    metricList.push({ index: parameterIndex, metric: new Gauge(config) });

    Reflect.defineMetadata(metricMetadataKey, metricList, target, propertyKey);
  };
}

export function Histogram1<T extends string>(
  config: HistogramConfiguration<T>,
): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const metricList: { index: number; metric: Metric<T> }[] =
      Reflect.getOwnMetadata(metricMetadataKey, target, propertyKey) || [];
    metricList.push({ index: parameterIndex, metric: new Histogram(config) });

    Reflect.defineMetadata(metricMetadataKey, metricList, target, propertyKey);
  };
}

export function Summary1<T extends string>(
  config: SummaryConfiguration<T>,
): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const metricList: { index: number; metric: Metric<T> }[] =
      Reflect.getOwnMetadata(metricMetadataKey, target, propertyKey) || [];
    metricList.push({ index: parameterIndex, metric: new Summary(config) });

    Reflect.defineMetadata(metricMetadataKey, metricList, target, propertyKey);
  };
}

export function MetricExecute(): MethodDecorator {
  return (
    target,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const method = descriptor.value;
    descriptor.value = function (...args) {
      const metrics = Reflect.getOwnMetadata(
        metricMetadataKey,
        target,
        propertyKey,
      );
      for (const { index, metric } of metrics) {
        args[index] = metric;
      }

      return method.apply(this, args);
    };
  };
}

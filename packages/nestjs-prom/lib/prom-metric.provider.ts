/**
 * Created by Rain on 2020/7/29
 */
import { Provider } from '@nestjs/common';
import {
  Counter,
  CounterConfiguration,
  Gauge,
  GaugeConfiguration,
  Histogram,
  HistogramConfiguration,
  Registry,
  Summary,
  SummaryConfiguration,
} from 'prom-client';

export function createPromCounterProvider(
  configuration: CounterConfiguration<string>,
): Provider {
  return {
    provide: configuration.name,
    useFactory: (registry: Registry) => {
      const obj = new Counter({
        ...configuration,
        registers: [registry],
      });
      return obj;
    },
    inject: [Registry],
  };
}

export function createPromGaugeProvider(
  configuration: GaugeConfiguration<string>,
): Provider {
  return {
    provide: configuration.name,
    useFactory: (registry: Registry) => {
      const obj = new Gauge({
        ...configuration,
        registers: [registry],
      });
      return obj;
    },
    inject: [Registry],
  };
}

export function createPromHistogramProvider(
  configuration: HistogramConfiguration<string>,
): Provider {
  return {
    provide: configuration.name,
    useFactory: (registry: Registry) => {
      const obj = new Histogram({
        ...configuration,
        registers: [registry],
      });
      return obj;
    },
    inject: [Registry],
  };
}

export function createPromSummaryProvider(
  configuration: SummaryConfiguration<string>,
): Provider {
  return {
    provide: configuration.name,
    useFactory: (registry: Registry) => {
      const obj = new Summary({
        ...configuration,
        registers: [registry],
      });
      return obj;
    },
    inject: [Registry],
  };
}

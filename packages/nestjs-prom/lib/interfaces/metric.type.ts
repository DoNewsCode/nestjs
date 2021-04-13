import * as PromClient from 'prom-client';

// eslint-disable-next-line no-shadow
export enum MetricType {
  Counter,
  Gauge,
  Histogram,
  Summary,
}

export interface MetricTypeConfigurationInterface {
  type: MetricType;
  configuration?: any;
}

export class MetricTypeCounter implements MetricTypeConfigurationInterface {
  type: MetricType = MetricType.Counter;
  configuration: PromClient.CounterConfiguration<string>;
}

export class MetricTypeGauge implements MetricTypeConfigurationInterface {
  type: MetricType = MetricType.Gauge;
  configuration: PromClient.GaugeConfiguration<string>;
}

export class MetricTypeHistogram implements MetricTypeConfigurationInterface {
  type: MetricType = MetricType.Histogram;
  configuration: PromClient.HistogramConfiguration<string>;
}

export class MetricTypeSummary implements MetricTypeConfigurationInterface {
  type: MetricType = MetricType.Summary;
  configuration: PromClient.SummaryConfiguration<string>;
}

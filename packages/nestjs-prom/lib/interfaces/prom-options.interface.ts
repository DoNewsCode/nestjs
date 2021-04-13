export interface PromModuleOptions {
  registerName?: string;

  /**
   * Enable default metrics
   * Under the hood, that call collectDefaultMetrics()
   */
  withDefaultsMetrics?: boolean;

  defaultLabels?: {
    [key: string]: any;
  };

  defaultMetricsCollectionConfig?: {
    prefix?: string;
    gcDurationBuckets?: number[];
    eventLoopMonitoringPrecision?: number;
  };
}

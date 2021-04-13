/**
 * Created by Rain on 2020/7/21
 */
import { ModuleMetadata, Type } from '@nestjs/common';
import { TracingConfig, TracingOptions } from 'jaeger-client';

export interface TracingModuleOptions {
  tracingConfig: TracingConfig;
  tracingOption: TracingOptions & {
    contextKey?: string;
    baggagePrefix?: string;
  };
}

export interface TracingOptionsFactory {
  createTracingOptions(): Promise<TracingModuleOptions> | TracingModuleOptions;
}

export interface TracingModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<TracingOptionsFactory>;
  useClass?: Type<TracingOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<TracingModuleOptions> | TracingModuleOptions;
  inject?: any[];
}

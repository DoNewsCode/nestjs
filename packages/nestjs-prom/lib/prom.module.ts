/**
 * Created by Rain on 2020/6/18
 */
import {
  DynamicModule,
  FactoryProvider,
  Global,
  Module,
  Provider,
  Type,
  ValueProvider,
} from '@nestjs/common';
import * as client from 'prom-client';
import { collectDefaultMetrics, Registry } from 'prom-client';

import { PROM_MODULE_OPTIONS } from './constant';
import {
  LoggerModuleAsyncOptions,
  MetricType,
  MetricTypeConfigurationInterface,
  PromModuleOptions,
  PromOptionsFactory,
} from './interfaces';
import {
  createPromCounterProvider,
  createPromGaugeProvider,
  createPromHistogramProvider,
  createPromSummaryProvider,
} from './prom-metric.provider';

@Global()
@Module({})
export class PromModule {
  static forRoot(
    options?: PromModuleOptions,
    metrics: MetricTypeConfigurationInterface[] = [],
  ): DynamicModule {
    options = Object.assign(PromModule.defaultOptions(), options);

    const {
      defaultLabels,
      defaultMetricsCollectionConfig,
      withDefaultsMetrics,
    } = options;

    const providers: Provider[] = [];
    const promOptionsProvider: ValueProvider = {
      provide: PROM_MODULE_OPTIONS,
      useValue: options,
    };
    providers.push(promOptionsProvider);

    const registerProvider: FactoryProvider = {
      provide: Registry,
      useFactory: () => {
        const register: Registry = client.register;

        if (defaultLabels) {
          register.setDefaultLabels(defaultLabels);
        }

        if (withDefaultsMetrics === true) {
          collectDefaultMetrics(
            Object.assign(
              {
                register,
              },
              defaultMetricsCollectionConfig,
            ),
          );
        }

        return register;
      },
    };
    providers.push(registerProvider);

    const metricProvider: Provider[] = metrics.map((entry) => {
      switch (entry.type) {
        case MetricType.Counter:
          return createPromCounterProvider(entry.configuration);
        case MetricType.Gauge:
          return createPromGaugeProvider(entry.configuration);
        case MetricType.Histogram:
          return createPromHistogramProvider(entry.configuration);
        case MetricType.Summary:
          return createPromSummaryProvider(entry.configuration);
        default:
          throw new ReferenceError(`The type ${entry.type} is not supported`);
      }
    });

    return {
      module: PromModule,
      imports: [],
      exports: [...providers, ...metricProvider],
      providers: [...providers, ...metricProvider],
    };
  }

  static forRootAsync(
    options: LoggerModuleAsyncOptions,
    metrics: MetricTypeConfigurationInterface[] = [],
  ): DynamicModule {
    const providers: Provider[] = [];

    providers.push(...this.createAsyncProviders(options));

    const registerFactory: FactoryProvider = {
      provide: Registry,
      useFactory: (_option: PromModuleOptions) => {
        const register = client.register;
        if (_option.withDefaultsMetrics === true) {
          collectDefaultMetrics();
        }

        if (_option.defaultLabels) {
          register.setDefaultLabels(_option.defaultLabels);
        }
        return register;
      },
      inject: [PROM_MODULE_OPTIONS],
    };
    providers.push(registerFactory);

    const metricProvider: Provider[] = metrics.map((entry) => {
      switch (entry.type) {
        case MetricType.Counter:
          return createPromCounterProvider(entry.configuration);
        case MetricType.Gauge:
          return createPromGaugeProvider(entry.configuration);
        case MetricType.Histogram:
          return createPromHistogramProvider(entry.configuration);
        case MetricType.Summary:
          return createPromSummaryProvider(entry.configuration);
        default:
          throw new ReferenceError(`The type ${entry.type} is not supported`);
      }
    });

    return {
      module: PromModule,
      imports: options.imports,
      providers: [...providers, ...metricProvider],
      exports: [...providers, ...metricProvider],
    };
  }

  private static createAsyncProviders(
    options: LoggerModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<PromOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: LoggerModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PROM_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<PromOptionsFactory>,
    ];
    return {
      provide: PROM_MODULE_OPTIONS,
      useFactory: async (optionsFactory: PromOptionsFactory) =>
        await optionsFactory.createLoggerOptions(),
      inject,
    };
  }

  private static defaultOptions(): PromModuleOptions {
    return {
      withDefaultsMetrics: true,
      defaultMetricsCollectionConfig: {},
    };
  }
}

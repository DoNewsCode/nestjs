import {
  DynamicModule,
  FactoryProvider,
  Global,
  Module,
  OnApplicationShutdown,
  Provider,
  Type,
} from '@nestjs/common';
import { initTracer, TracingConfig, TracingOptions } from 'jaeger-client';
import { Tracer } from 'opentracing';

import { TRACER, TRACING_MODULE_OPTIONS } from './constant';
import { AsyncHooksModule } from './hook';
import {
  TracingModuleAsyncOptions,
  TracingModuleOptions,
  TracingOptionsFactory,
} from './interface/tracing.interface';
import { formatTracingModuleOptions } from './util/tracing-module-options.util';

/**
 * Created by Rain on 2020/7/16
 */
@Global()
@Module({
  imports: [AsyncHooksModule],
  providers: [],
  exports: [],
})
export class TracingModule implements OnApplicationShutdown {
  static tracer: Tracer;

  static forRoot(option: {
    tracingConfig: TracingConfig;
    tracingOption: TracingOptions & {
      contextKey?: string;
      baggagePrefix?: string;
    };
  }): DynamicModule {
    const { tracingConfig, tracingOption } = formatTracingModuleOptions(option);

    const providers: Provider[] = [];
    const tracerModuleOption: Provider<TracingModuleOptions> = {
      provide: TRACING_MODULE_OPTIONS,
      useValue: { tracingConfig, tracingOption },
    };
    providers.push(tracerModuleOption);

    const tracerProvider: Provider = {
      provide: TRACER,
      useFactory() {
        const tracer: Tracer = initTracer(tracingConfig, tracingOption);
        TracingModule.tracer = tracer;
        return tracer;
      },
    };
    providers.push(tracerProvider);

    return {
      imports: [],
      module: TracingModule,
      providers,
      exports: [...providers],
    };
  }

  static forRootAsync(options: TracingModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [];

    const TracerServiceProvider: FactoryProvider = {
      provide: TRACER,
      useFactory: (_options: TracingModuleOptions) => {
        const { tracingConfig, tracingOption } =
          formatTracingModuleOptions(_options);

        const tracer: Tracer = initTracer(tracingConfig, tracingOption);
        TracingModule.tracer = tracer;
        return tracer;
      },
      inject: [TRACING_MODULE_OPTIONS],
    };
    providers.push(TracerServiceProvider);

    providers.push(...TracingModule.createAsyncProviders(options));

    return {
      imports: [],
      module: TracingModule,
      providers,
      exports: [...providers],
    };
  }

  private static createAsyncProviders(
    options: TracingModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<TracingOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: TracingModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: TRACING_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<TracingOptionsFactory>,
    ];
    return {
      provide: TRACING_MODULE_OPTIONS,
      useFactory: async (optionsFactory: TracingOptionsFactory) =>
        await optionsFactory.createTracingOptions(),
      inject,
    };
  }

  onApplicationShutdown(signal?: string): any {
    (TracingModule.tracer as any).close();
  }
}

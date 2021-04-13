import {
  DynamicModule,
  FactoryProvider,
  Global,
  Module,
  Provider,
  Type,
  ValueProvider,
} from '@nestjs/common';

import { LOGGER, LOGGER_MODULE_OPTIONS, LOGGER_TYPE } from './constant';
import {
  LoggerModuleAsyncOptions,
  LoggerOptions,
  LoggerOptionsFactory,
} from './interfaces';
import { JsonLoggerService, PlainLoggerService } from './services';
import { CommonUtil } from './util/common.util';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(options: LoggerOptions): DynamicModule {
    const providers: Provider[] = [];

    const loggerOptionsProvider: ValueProvider = {
      provide: LOGGER_MODULE_OPTIONS,
      useValue: options,
    };
    providers.push(loggerOptionsProvider);

    const LoggerServiceProvider: FactoryProvider = {
      provide: LOGGER,
      useFactory: (_options: LoggerOptions) => {
        CommonUtil.checkLogType(_options.loggerType);

        let LoggerService: any;
        if (_options.loggerType === LOGGER_TYPE.JSON_MODEL) {
          LoggerService = JsonLoggerService;
        }
        if (_options.loggerType === LOGGER_TYPE.PLAIN_MODEL) {
          LoggerService = PlainLoggerService;
        }
        const logInstance = new LoggerService(_options);
        logInstance.setLogLevel(_options.loggerLevel);
        return logInstance;
      },
      inject: [LOGGER_MODULE_OPTIONS],
    };
    providers.push(LoggerServiceProvider);

    return {
      module: LoggerModule,
      providers: providers,
      exports: providers,
    };
  }

  static forRootAsync(options: LoggerModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [];

    const LoggerServiceProvider: FactoryProvider = {
      provide: LOGGER,
      useFactory: (_options: LoggerOptions) => {
        CommonUtil.checkLogType(_options.loggerType);

        let LoggerService: any;
        if (_options.loggerType === LOGGER_TYPE.JSON_MODEL) {
          LoggerService = JsonLoggerService;
        }
        if (_options.loggerType === LOGGER_TYPE.PLAIN_MODEL) {
          LoggerService = PlainLoggerService;
        }
        const logInstance = new LoggerService(_options);
        logInstance.setLogLevel(_options.loggerLevel);
        return logInstance;
      },
      inject: [LOGGER_MODULE_OPTIONS],
    };
    providers.push(LoggerServiceProvider);

    providers.push(...this.createAsyncProviders(options));
    return {
      module: LoggerModule,
      imports: options.imports,
      providers: providers,
      exports: providers,
    };
  }

  private static createAsyncProviders(
    options: LoggerModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<LoggerOptionsFactory>;
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
        provide: LOGGER_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<LoggerOptionsFactory>,
    ];
    return {
      provide: LOGGER_MODULE_OPTIONS,
      useFactory: async (
        optionsFactory: LoggerOptionsFactory,
      ): Promise<LoggerOptions> => await optionsFactory.createLoggerOptions(),
      inject,
    };
  }
}

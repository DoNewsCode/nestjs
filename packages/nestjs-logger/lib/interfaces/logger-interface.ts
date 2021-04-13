import { LoggerService, Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

import { LOGGER_TYPE, LoggerLevel } from '../constant';

export interface LoggerInterface extends LoggerService {
  info(message: string, context?: string): void;
  error(message: string, trace?: string, context?: string): void;
  warn(message: string, context?: string): any;
  debug?(message: string, context?: string): any;
  verbose?(message: string, context?: string): any;
  setLogLevel(logLevel: LoggerLevel): void;
  setLogContextRegex(contextList: string | RegExp | (string | RegExp)[]): void;
}

export interface LoggerOptions {
  context?: string;
  loggerType?: LOGGER_TYPE;
  loggerLevel?: LoggerLevel;
  loggerContextList?: string | RegExp | (string | RegExp)[];
}

export interface LoggerOptionsFactory {
  createLoggerOptions(): Promise<LoggerOptions> | LoggerOptions;
}

export interface LoggerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<LoggerOptionsFactory>;
  useClass?: Type<LoggerOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<LoggerOptions> | LoggerOptions;
  inject?: any[];
}

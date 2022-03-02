import { LoggerService, Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

import { LOGGER_TYPE, LoggerLevel } from '../constant';

export type LogInfoType = string | Record<any, any>;

export interface LoggerInterface extends LoggerService {
  info(message: LogInfoType, context?: string): void;
  error(message: LogInfoType, trace?: string, context?: string): void;
  warn(message: LogInfoType, context?: string): any;
  debug?(message: LogInfoType, context?: string): any;
  verbose?(message: LogInfoType, context?: string): any;
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

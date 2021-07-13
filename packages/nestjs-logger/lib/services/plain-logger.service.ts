import { ConsoleLogger } from '@nestjs/common';

import { DonewsLoggerLevels, LoggerLevel } from '../constant';
import { LoggerInterface, LoggerOptions } from '../interfaces';
import { CommonUtil } from '../util/common.util';

export class PlainLoggerService
  extends ConsoleLogger
  implements LoggerInterface
{
  private loggerLevel: LoggerLevel;
  private loggerContextRegexList: RegExp[] = [];

  constructor(loggerOptions: LoggerOptions) {
    super(loggerOptions.context);
    this.setLogLevel(loggerOptions.loggerLevel);
    this.setLogContextRegex(loggerOptions.loggerContextList);
  }

  isPrint(level: LoggerLevel, context?: string): boolean {
    if (CommonUtil.checkContextByRegex(this.loggerContextRegexList, context)) {
      return true;
    }
    return DonewsLoggerLevels[this.loggerLevel] >= DonewsLoggerLevels[level];
  }

  error(message: string, trace: string = '', context: string = ''): void {
    if (!this.isPrint('error', context)) {
      return;
    }
    if (!context) {
      context = this.context;
    }
    super.error(message, trace, context);
  }

  warn(message: string, context?: string): void {
    if (!this.isPrint('warn', context)) {
      return;
    }
    if (!context) {
      context = this.context;
    }
    super.warn(message, context);
  }

  log(message: string, context?: string): void {
    if (!this.isPrint('log', context)) {
      return;
    }
    if (!context) {
      context = this.context;
    }
    super.log(message, context);
  }

  info(message: string, context?: string): void {
    if (!this.isPrint('info', context)) {
      return;
    }
    if (!context) {
      context = this.context;
    }
    super.log(message, context);
  }

  debug(message: string, context?: string): void {
    if (!this.isPrint('debug', context)) {
      return;
    }
    if (!context) {
      context = this.context;
    }
    super.debug(message, context);
  }

  verbose(message: string, context?: string): void {
    if (!this.isPrint('verbose', context)) {
      return;
    }
    if (!context) {
      context = this.context;
    }
    super.verbose(message, context);
  }

  setLogLevel(logLevel: LoggerLevel): void {
    this.loggerLevel = CommonUtil.checkLogLevel(logLevel);
  }

  setLogContextRegex(contextList: string | RegExp | (string | RegExp)[]): void {
    this.loggerContextRegexList =
      CommonUtil.generateContextRegexList(contextList);
  }
}

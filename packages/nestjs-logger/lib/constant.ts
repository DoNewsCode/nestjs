export const LOGGER = Symbol.for('logger');
export const LOGGER_MODULE_OPTIONS = Symbol.for('LOGGER_MODULE_OPTIONS');

export enum LOGGER_TYPE {
  JSON_MODEL = 'json',
  PLAIN_MODEL = 'plain',
}

export type LoggerLevel =
  | 'error'
  | 'warn'
  | 'log'
  | 'info'
  | 'verbose'
  | 'debug';

export const DonewsLoggerLevels: { [key in LoggerLevel]: number } = {
  error: 0,
  warn: 1,
  log: 2,
  info: 2,
  debug: 3,
  verbose: 4,
};

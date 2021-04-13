import { DonewsLoggerLevels, LOGGER_TYPE, LoggerLevel } from '../constant';

/**
 * Created by Rain on 2020/6/16
 */
export class CommonUtil {
  static checkContextByRegex(regexList: RegExp[], context: string): boolean {
    if (!regexList || !Array.isArray(regexList)) {
      return false;
    }
    if (regexList.length >= 0) {
      for (const regex of regexList) {
        if (regex.test(context)) {
          return true;
        }
      }
    }
    return false;
  }

  static generateContextRegexList(
    contextList: string | RegExp | (string | RegExp)[],
  ): RegExp[] {
    let array = [];
    if (typeof contextList === 'undefined') {
      array = [];
    } else if (!Array.isArray(contextList)) {
      array.push(contextList);
    } else {
      array = array.concat(contextList);
    }

    return array.reduce((acc, context: string | RegExp) => {
      if (typeof context === 'string') {
        acc.push(new RegExp(context));
      } else if (context instanceof RegExp) {
        acc.push(context);
      } else {
        throw new Error('please input string or regex');
      }
      return acc;
    }, []);
  }

  static checkLogLevel(logLevel: LoggerLevel): LoggerLevel {
    if (typeof logLevel !== 'string') {
      throw new Error('Please logLevel is string');
    }
    if (typeof DonewsLoggerLevels[logLevel] !== 'number') {
      throw new Error(`Please input correct logLevel,current:${logLevel}`);
    }
    return logLevel || 'debug';
  }

  static checkLogType(logType: string): boolean {
    if (
      LOGGER_TYPE.PLAIN_MODEL === logType ||
      LOGGER_TYPE.JSON_MODEL === logType
    ) {
      return true;
    } else {
      throw new Error('Please input correct logger type[json,plain]!');
    }
  }
}

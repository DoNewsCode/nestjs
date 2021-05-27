/**
 * Created by Rain on 2020/3/26
 */
import { Inject, Injectable } from '@nestjs/common';
import { get } from 'lodash';

import { CONFIGURATION_TOKEN } from './config.constants';

function isUndefined(value: any): boolean {
  return typeof value === 'undefined';
}

@Injectable()
export class ConfigService {
  constructor(
    @Inject(CONFIGURATION_TOKEN)
    private readonly internalConfig: Record<string, any> = {},
  ) {}

  /**
   * Get a configuration value (either custom configuration or process environment variable)
   * It returns a default value if the key does not exist.
   * @param propertyPath
   */
  get<T = any>(propertyPath: string): T | undefined;
  /**
   * Get a configuration value (either custom configuration or process environment variable)
   * It returns a default value if the key does not exist.
   * @param propertyPath
   * @param defaultValue
   */
  get<T = any>(propertyPath: string, defaultValue: T): T;
  /**
   * Get a configuration value (either custom configuration or process environment variable)
   * It returns a default value if the key does not exist.
   * @param propertyPath
   * @param defaultValue
   */
  get<T = any>(propertyPath: string, defaultValue?: T): T | undefined {
    const processValue = process.env?.[propertyPath];
    // 这里其实应该去yargs取，暂时懒得改（这里有个限制,process.env只能传输字符串）
    if (!isUndefined(processValue)) {
      return processValue as unknown as T;
    }
    const internalValue = get(this.internalConfig, propertyPath);
    return isUndefined(internalValue) ? defaultValue : internalValue;
  }
}

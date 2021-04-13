/**
 * Created by Rain on 2020/6/19
 */
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

import { PromModuleOptions } from './prom-options.interface';

export interface PromOptionsFactory {
  createLoggerOptions(): Promise<PromModuleOptions> | PromModuleOptions;
}

export interface LoggerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<PromOptionsFactory>;
  useClass?: Type<PromOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<PromModuleOptions> | PromModuleOptions;
  inject?: any[];
}

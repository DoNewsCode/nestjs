/**
 * Created by Rain on 2020/3/25
 */
import * as fs from 'fs';

import { ValidationOptions } from '@hapi/joi';
import { DynamicModule, FactoryProvider, Module } from '@nestjs/common';
import { load } from 'js-yaml';

import {
  CONFIGURATION_TOKEN,
  VALIDATED_ENV_LOADER,
  VALIDATED_ENV_PROPNAME,
} from './config.constants';
import { ConfigService } from './config.service';
import { ConfigModuleOptions } from './interfaces';

@Module({
  providers: [
    {
      provide: CONFIGURATION_TOKEN,
      useFactory: (): any => ({}),
    },
    ConfigService,
  ],
  exports: [ConfigService],
})
export class ConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    const { ignoreEnvFile, ignoreCheckEnvVars, validationSchema } = options;

    let validatedEnvConfig: Record<string, any> | undefined = {};

    // 是否 忽略 配置文档
    if (!ignoreEnvFile) {
      validatedEnvConfig = this.loadConfigFile(options);
    }

    // 是否 忽略 环境变量
    if (!ignoreCheckEnvVars) {
      validatedEnvConfig = Object.assign({}, validatedEnvConfig, process.env);
    }

    // 是否 是用 validate 检测
    if (validationSchema) {
      const validationOptions = this.getSchemaValidationOptions(options);
      const { error } = validationSchema.validate(
        validatedEnvConfig,
        validationOptions,
      );

      if (error) {
        throw new Error(`Config validation error: ${error.message}`);
      }
    }

    const providers: FactoryProvider[] = [];
    // 将值 赋值进  内部缓存
    if (validatedEnvConfig) {
      const validatedEnvConfigLoader = {
        provide: VALIDATED_ENV_LOADER,
        useFactory: (innerCache: Record<string, any>) => {
          innerCache[VALIDATED_ENV_PROPNAME] = validatedEnvConfig;
          if (validatedEnvConfig !== undefined) {
            for (const key of Object.keys(validatedEnvConfig)) {
              innerCache[key] = validatedEnvConfig[key];
            }
          }
        },
        inject: [CONFIGURATION_TOKEN],
      };
      providers.push(validatedEnvConfigLoader);
    }

    return {
      module: ConfigModule,
      global: options.isGlobal,
      providers: providers,
      exports: [ConfigService, ...providers],
    };
  }

  private static loadConfigFile(
    options: ConfigModuleOptions,
  ): Record<any, any> {
    const envFilePaths: string[] = Array.isArray(options.envFilePath)
      ? options.envFilePath
      : [options.envFilePath ?? process.cwd() + '/config/default.yaml'];

    let config: ReturnType<typeof load> = {};
    for (const envFilePath of envFilePaths) {
      if (fs.existsSync(envFilePath)) {
        config = Object.assign(
          load(fs.readFileSync(envFilePath, { encoding: 'utf8' })),
          config,
        );
      }
    }
    return config;
  }

  private static getSchemaValidationOptions(
    options: ConfigModuleOptions,
  ): ValidationOptions {
    if (options.validationOptions) {
      if (typeof options.validationOptions?.allowUnknown === 'undefined') {
        options.validationOptions.allowUnknown = true;
      }
      return options.validationOptions || {};
    }
    return {
      abortEarly: false,
      allowUnknown: true,
    };
  }
}

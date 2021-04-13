/**
 * Created by Rain on 2020/3/26
 */
import { join } from 'path';

import * as Joi from '@hapi/joi';
import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '../../lib';

@Module({})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  static withEnvFile(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: join(__dirname, './config/development.yaml'),
        }),
      ],
    };
  }

  static withMultipleEnvFile(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [
            join(__dirname, './config/development.yaml'),
            join(__dirname, './config/development2.yaml'),
          ],
        }),
      ],
    };
  }

  static withSchemaValidation(envFilePath?: string): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath,
          validationSchema: Joi.object({
            PORT: Joi.number().required(),
            DATABASE_NAME: Joi.string().required(),
          }),
        }),
      ],
    };
  }

  getConfigService(): ConfigService {
    return this.configService;
  }
}

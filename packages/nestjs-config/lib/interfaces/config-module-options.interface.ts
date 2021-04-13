/**
 * Created by Rain on 2020/3/25
 */
import { AnySchema, ValidationOptions } from '@hapi/joi';

export interface ConfigModuleOptions {
  /**
   * If "true", registers `ConfigModule` as a global module.
   * See: https://docs.nestjs.com/modules#global-modules
   */
  isGlobal?: boolean;

  /**
   * If "true", environment files (`.env`) will be ignored.
   */
  ignoreEnvFile?: boolean;

  /**
   * If "true", predefined environment variables will not be validated.
   */
  ignoreCheckEnvVars?: boolean;

  /**
   * Path to the environment file(s) to be loaded.
   */
  envFilePath?: string | string[];

  /**
   * Environment file encoding.
   */
  encoding?: string;

  /**
   * Environment variables validation schema (Joi).
   */
  validationSchema?: AnySchema;

  /**
   * Schema validation options.
   * See: https://hapi.dev/family/joi/?v=16.1.8#anyvalidatevalue-options
   */
  validationOptions?: ValidationOptions;
}

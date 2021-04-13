import * as assert from 'assert';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { LOGGER, LoggerInterface, LoggerModule, LoggerOptions } from '../lib';

import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

describe('json-logger.service.spec', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRootAsync({
          name: 'test',
          useFactory(configService: ConfigService): LoggerOptions {
            return {
              loggerType: configService.getJson(),
              loggerLevel: 'debug',
              context: 'test',
            };
          },
          inject: [ConfigService],
          imports: [ConfigModule],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('test', () => {
    const log = app.get<'string', LoggerInterface>(LOGGER);
    log.info(JSON.stringify({ a: 1 }));
  });

  it('log type error', async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          LoggerModule.forRootAsync({
            name: 'test',
            useFactory(configService: ConfigService): LoggerOptions {
              return {
                loggerType: '' as any,
                loggerLevel: 'debug',
                context: 'test',
              };
            },
            inject: [ConfigService],
            imports: [ConfigModule],
          }),
        ],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    } catch (e) {
      assert.strictEqual(
        e.message,
        'Please input correct logger type[json,plain]!',
      );
    }
  });

  it('log level error', async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          LoggerModule.forRootAsync({
            name: 'test',
            useFactory(configService: ConfigService): LoggerOptions {
              return {
                loggerType: configService.getJson(),
                loggerLevel: 'x' as any,
                context: 'test',
              };
            },
            inject: [ConfigService],
            imports: [ConfigModule],
          }),
        ],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    } catch (e) {
      assert.strictEqual(e.message, 'Please input correct logLevel,current:x');
    }
  });
});

/**
 * Created by Rain on 2020/3/27
 */
import * as assert from 'assert';
import { join } from 'path';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { ConfigService } from '../../lib';
import { AppModule } from '../src/app.module';

describe('envFilePath test', () => {
  let app: INestApplication;

  it(`should validate loaded env variables`, async () => {
    try {
      const module = await Test.createTestingModule({
        imports: [AppModule.withSchemaValidation()],
      }).compile();

      app = module.createNestApplication();
      await app.init();
    } catch (err) {
      assert.strictEqual(
        err.message,
        'Config validation error: "PORT" is required. "DATABASE_NAME" is required',
      );
    }
  });

  it(`should parse loaded env variables`, async () => {
    const module = await Test.createTestingModule({
      imports: [
        AppModule.withSchemaValidation(join(__dirname, 'validation.yaml')),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const configService = app.get(ConfigService);
    assert.strictEqual(configService.get<string>('PORT'), 4000);
    assert.strictEqual(configService.get<string>('DATABASE_NAME'), 'test');
    assert.strictEqual(configService.get<boolean>('FLAG_BOOLEAN'), true);

    assert.deepStrictEqual(
      configService.get<{ host: string; port: number }[]>('REDIS_CLUSTER_NODE'),
      [
        { host: '127.0.0.1', port: 7000 },
        { host: '127.0.0.1', port: 7001 },
      ],
    );

    assert.deepStrictEqual(
      configService.get<{ name: string; age: number }>('PERSON'),
      { name: 'toonewLi', age: 1000 },
    );
  });
});

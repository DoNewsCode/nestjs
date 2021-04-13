/**
 * Created by Rain on 2020/3/26
 */
import * as assert from 'assert';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../src/app.module';

describe('envFilePath test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule.withMultipleEnvFile()],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`should return env file variable`, () => {
    const configService = app
      .get<AppModule, AppModule>(AppModule)
      .getConfigService();
    assert.strictEqual(configService.get<string>('PORT'), 4000);
    assert.strictEqual(configService.get<string>('TIMEOUT'), 5000);
    assert.strictEqual(configService.get<string>('OBJ1.filed1'), 2);

    assert.strictEqual(configService.get<string>('DEV2_PORT'), 6000);
    assert.strictEqual(configService.get<string>('DEV2_TIMEOUT'), 7000);
  });

  afterEach(async () => {
    await app.close();
  });
});

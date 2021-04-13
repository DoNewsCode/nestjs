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
      imports: [AppModule.withEnvFile()],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`should return env file variable`, () => {
    const configService = app
      .get<AppModule, AppModule>(AppModule)
      .getConfigService();
    assert.strictEqual(configService.get<string>('PORT'), 4000);
  });

  afterEach(async () => {
    await app.close();
  });
});

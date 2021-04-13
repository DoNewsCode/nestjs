import * as assert from 'assert';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../src/app.module';

/**
 * Created by Rain on 2021/4/9
 */
describe('env', () => {
  let app: INestApplication;

  beforeEach(async () => {
    process.env.PORT = '5000';
    const module = await Test.createTestingModule({
      imports: [AppModule.withEnvFile()],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`should return env variable`, () => {
    const configService = app
      .get<AppModule, AppModule>(AppModule)
      .getConfigService();
    assert.strictEqual(configService.get<string>('PORT'), '5000');
  });

  afterEach(async () => {
    delete process.env.PORT;
    await app.close();
  });
});

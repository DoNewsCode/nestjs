/**
 * Created by Rain on 2020/7/20
 */
import * as assert from 'assert';

import { HttpModule, HttpService } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';

import { TracingModule } from '../lib';

describe('http module', () => {
  let service: HttpService;
  let moduleRef: TestingModule;
  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TracingModule.forRoot({
          tracingOption: {},
          tracingConfig: {
            serviceName: 'foo',
            sampler: { param: 1, type: 'const' },
          },
        }),
        HttpModule,
      ],
    }).compile();
    const app: INestApplication = moduleRef.createNestApplication();
    await app.init();
    service = moduleRef.get(HttpService);
  });

  it('should start tracing span', async () => {
    const sandbox = sinon.createSandbox();

    const tracer = TracingModule.tracer;
    sandbox.spy(tracer, 'startSpan');

    const result = await service.get('http://hk.jd.com', {}).toPromise();
    assert.strictEqual((tracer.startSpan as any).calledOnce, true);
    sandbox.restore();
  });

  afterEach(() => {
    moduleRef.close();
  });
});

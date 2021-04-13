import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { LOGGER, LOGGER_TYPE, LoggerInterface, LoggerModule } from '../lib';

describe('plain-logger.service test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          loggerType: LOGGER_TYPE.PLAIN_MODEL,
          loggerLevel: 'verbose',
          context: 'test',
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('test', () => {
    const log = app.get<'string', LoggerInterface>(LOGGER);
    // 此输出依赖官方logger简版试下,普通启动和test启动不一样
    // 因为官方的test 方式启动 logger 不完整，test中删除了info,warn的输出，仅仅保留了error
    // sourcePath: @nestjs/testing/services/testing-logger.service.js
    log.info(JSON.stringify({ a: 1 }));
    log.warn(JSON.stringify({ a: 1 }));
    log.error(JSON.stringify({ a: 1 }));
  });

  it('just print ', () => {
    const log = app.get<'string', LoggerInterface>(LOGGER);
    log.error('error', 'error.stack', 'error');
    log.warn('warn', 'warn');
    log.log('log', 'log');
    log.info('info', 'info');
    log.debug('debug', 'debug');
    log.verbose('verbose', 'verbose');
  });

  it('setLogContextRegex test', () => {
    const log = app.get<'string', LoggerInterface>(LOGGER);
    log.setLogLevel('error');

    // debug 默认不显示
    log.setLogContextRegex(['test1']);
    log.verbose(JSON.stringify({ test: '条件：[test1] 不出' }), '');
    log.verbose(JSON.stringify({ test: '条件：[test1] 出' }), 'test1'); // 出

    log.setLogContextRegex('test2');
    log.verbose(JSON.stringify({ test: '条件：test2 不出' }), 'test'); // 不出
    log.verbose(JSON.stringify({ test: '条件：test2 出' }), 'test2'); // 出

    log.setLogContextRegex(/test3/);
    log.verbose(JSON.stringify({ test: '条件：/test3/ 不出' }), 'test'); // 不出
    log.verbose(JSON.stringify({ test: '条件：/test3/ 出' }), 'test3'); // 出

    log.setLogContextRegex([/test4/]);
    log.verbose(JSON.stringify({ test: '条件：[test4] 不出' }), 'test'); // 不出
    log.verbose(JSON.stringify({ test: '条件：[test4] 出' }), 'test4'); // 出
  });

  it('module init contextList test', async () => {
    const log = await generatorLog(['regex test']);
    log.debug(`条件：['regex test'] 不出`, 's');
    log.debug(`条件：['regex test'] 出`, 'regex test');

    const log2 = await generatorLog([/regex te.*/]);
    log2.debug(`条件：[/regex te.*/] 不出`, 's');
    log2.debug(`条件：[/regex te.*/] 出`, 'regex test');

    const log3 = await generatorLog('regex test');
    log3.debug(`条件：regex test 不出`, 's');
    log3.debug(`条件：regex test 出`, 'regex test');

    const log4 = await generatorLog(/regex te.*/);
    log4.debug(`条件：regex test 不出`, 's');
    log4.debug(`条件：regex test 出`, 'regex test');

    async function generatorLog(contextList) {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          LoggerModule.forRoot({
            loggerType: LOGGER_TYPE.PLAIN_MODEL,
            loggerLevel: 'error',
            context: 'test',
            loggerContextList: contextList,
          }),
        ],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
      return app.get<'string', LoggerInterface>(LOGGER);
    }
  });
});

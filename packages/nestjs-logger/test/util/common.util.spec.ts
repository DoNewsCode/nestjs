/**
 * Created by Rain on 2020/6/16
 */
import * as assert from 'assert';

import { CommonUtil } from '../../lib/util/common.util';

describe('common util ', () => {
  describe('checkContextRegex', () => {
    it('null context', () => {
      const regex = null;
      assert.strictEqual(
        CommonUtil.checkContextByRegex(regex, 'context1'),
        false,
      );
      assert.strictEqual(
        CommonUtil.checkContextByRegex(regex, 'context1'),
        false,
      );
    });
    it('empty array context', () => {
      const regex = [];
      assert.strictEqual(
        CommonUtil.checkContextByRegex(regex, 'context1'),
        false,
      );
      assert.strictEqual(
        CommonUtil.checkContextByRegex(regex, 'context1'),
        false,
      );
    });

    it('regex', () => {
      const regex = [/context1.*ts/];
      assert.strictEqual(
        CommonUtil.checkContextByRegex(regex, 'context1-xxx.ts'),
        true,
      );
      assert.strictEqual(
        CommonUtil.checkContextByRegex(regex, 'context2-xx.ts'),
        false,
      );
    });
  });

  describe('getContextRegexList', () => {
    it('字符串 数字', () => {
      const regexList: RegExp[] = CommonUtil.generateContextRegexList('0');
      assert.strictEqual(regexList[0].test('0'), true);
      assert.strictEqual(regexList[0].test('1'), false);
    });

    it('字符串 数字 数组', () => {
      const regexList: RegExp[] = CommonUtil.generateContextRegexList('0');
      assert.strictEqual(regexList[0].test('0'), true);
      assert.strictEqual(regexList[0].test('1'), false);
    });

    it('字符串 ', () => {
      const regexList: RegExp[] = CommonUtil.generateContextRegexList('test');
      assert.strictEqual(regexList[0].test('test'), true);
      assert.strictEqual(regexList[0].test('tes2'), false);
    });

    it('字符串 数组', () => {
      const regexList: RegExp[] = CommonUtil.generateContextRegexList(['test']);
      assert.strictEqual(regexList[0].test('test'), true);
      assert.strictEqual(regexList[0].test('tes2'), false);
    });

    it('正则', () => {
      const regexList: RegExp[] = CommonUtil.generateContextRegexList(/te.*1/);
      assert.strictEqual(regexList[0].test('testx1'), true);
      assert.strictEqual(regexList[0].test('testx2'), false);
    });

    it('正则数组', () => {
      const regexList: RegExp[] = CommonUtil.generateContextRegexList([
        /te.*1/,
      ]);
      assert.strictEqual(regexList[0].test('testx1'), true);
      assert.strictEqual(regexList[0].test('testx2'), false);
    });

    it('混合参数 数组', () => {
      const regexList: RegExp[] = CommonUtil.generateContextRegexList([
        '0',
        'test',
        /te.*1/,
      ]);

      assert.strictEqual(regexList[0].test('0'), true);
      assert.strictEqual(regexList[0].test('1'), false);

      assert.strictEqual(regexList[1].test('test'), true);
      assert.strictEqual(regexList[1].test('tes2'), false);

      assert.strictEqual(regexList[2].test('testx1'), true);
      assert.strictEqual(regexList[2].test('testx2'), false);
    });
  });

  describe('getLogLevel', () => {
    it('empty null', () => {
      try {
        const str = null as any;
        CommonUtil.checkLogLevel(str);
      } catch (err) {
        assert.strictEqual(err.message, 'Please logLevel is string');
      }
    });

    it('input number error', () => {
      try {
        const str = 0 as any;
        CommonUtil.checkLogLevel(str);
      } catch (err) {
        assert.strictEqual(err.message, 'Please logLevel is string');
      }
    });

    it('loglevel spell error', () => {
      const str = 'debug1' as any;
      try {
        CommonUtil.checkLogLevel(str);
      } catch (err) {
        assert.strictEqual(
          err.message,
          `Please input correct logLevel,current:${str}`,
        );
      }
    });

    it('all logLevel', () => {
      assert.strictEqual(CommonUtil.checkLogLevel('error'), 'error');
      assert.strictEqual(CommonUtil.checkLogLevel('verbose'), 'verbose');
      assert.strictEqual(CommonUtil.checkLogLevel('info'), 'info');
      assert.strictEqual(CommonUtil.checkLogLevel('log'), 'log');
      assert.strictEqual(CommonUtil.checkLogLevel('debug'), 'debug');
      assert.strictEqual(CommonUtil.checkLogLevel('verbose'), 'verbose');
    });
  });
});

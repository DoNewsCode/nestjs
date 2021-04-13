/**
 * Created by Rain on 2020/7/22
 */
import * as assert from 'assert';

import { SpanD } from '../lib';

class Test2Spec {
  @SpanD('Test2Spc')
  say() {
    return 's';
  }
}

describe.skip('test2', () => {
  it(' async context not run before spanD run ', () => {
    const test = new Test2Spec();

    assert.strictEqual(test.say(), 's');
  });
});

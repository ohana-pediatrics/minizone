import * as assert from 'assert'
import {Zone} from '../src';

process.nextTick(async () => {
  const z = Zone.current.fork({ properties: { data: 'test' } });

  const result = await z.run(async () => {
    return Zone.current.get('data')
  });

  assert.strictEqual(result, 'test')
});

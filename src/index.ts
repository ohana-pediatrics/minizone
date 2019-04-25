import * as ah from 'async_hooks';

const zones = new Map();

export const Zone = {
  get current() {
    return zones.get(ah.executionAsyncId())
  }
};

class TheZone {
  private readonly data = {};

  constructor(data) {
    this.data = data
  }

  fork(spec) {
    const z = new TheZone({...spec.properties, ...this.data});
    zones.set(ah.executionAsyncId(), z);

    return z
  }

  run(cb) {
    return cb()
  }

  get(key) {
    return this.data[key]
  }
}

ah.createHook({
  init: (id, __, parentId) => zones.set(id, zones.get(parentId)),
  destroy: (id) => zones.delete(id)
}).enable();

zones.set(ah.executionAsyncId(), new TheZone({}));

import * as ah from 'async_hooks';

export const Zone = {
  zones: new Map(),
  get current() {
    if (!this.zones.get(ah.executionAsyncId())) {
      this.zones.set(ah.executionAsyncId(), new TheZone({}))
    }

    return this.zones.get(ah.executionAsyncId());
  }
};

class TheZone {
  private readonly data = {};

  constructor(data) {
    this.data = data
  }

  fork(spec) {
    const z = new TheZone({...spec.properties, ...this.data});
    Zone.zones.set(ah.executionAsyncId(), z);

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
  init: (id, __, parentId) => Zone.zones.set(id, Zone.zones.get(parentId)),
  destroy: (id) => Zone.zones.delete(id)
}).enable();

Zone.zones.set(ah.executionAsyncId(), new TheZone({}));

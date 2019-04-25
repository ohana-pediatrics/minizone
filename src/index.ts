import * as ah from 'async_hooks';

class ZoneClass {
  private readonly data = {};
  protected static zones = new Map();

  static init() {
    ah.createHook({
      init: (id, __, parentId) => ZoneClass.zones.set(id, ZoneClass.zones.get(parentId)),
      destroy: (id) => ZoneClass.zones.delete(id)
    }).enable();

    return ZoneClass;
  }

  static get current() {
    if (!ZoneClass.zones.get(ah.executionAsyncId())) {
      ZoneClass.zones.set(ah.executionAsyncId(), new ZoneClass({}))
    }

    return this.zones.get(ah.executionAsyncId());
  }

  private constructor(data) {
    this.data = data
  }

  fork(spec) {
    const z = new ZoneClass({...this.data, ...spec.properties});
    ZoneClass.zones.set(ah.executionAsyncId(), z);

    return z
  }

  run(cb) {
    return cb()
  }

  get(key) {
    return this.data[key]
  }
}

export const Zone = ZoneClass.init();

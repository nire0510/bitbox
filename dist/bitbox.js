var m = Object.defineProperty;
var g = (i, e, s) => e in i ? m(i, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : i[e] = s;
var n = (i, e, s) => (g(i, typeof e != "symbol" ? e + "" : e, s), s);
class w {
  constructor() {
    n(this, "subscribers");
    this.subscribers = {};
  }
  generateId() {
    return Math.random().toString(36).substring(2, 9);
  }
  publish(e, ...s) {
    const t = this.subscribers[e];
    this.subscribers[e] && Object.keys(t).forEach((r) => {
      t[r](...s);
    });
  }
  subscribe(e, s) {
    const t = this.generateId();
    return this.subscribers[e] || (this.subscribers[e] = {}), this.subscribers[e][t] = s, t;
  }
  unsubscribe(e, s) {
    var t;
    (t = this.subscribers[e]) == null || delete t[s];
  }
}
var c = /* @__PURE__ */ ((i) => (i[i.IndexedDB = 1] = "IndexedDB", i[i.LocalStorage = 2] = "LocalStorage", i[i.SessionStorage = 3] = "SessionStorage", i))(c || {});
const u = class u {
  constructor(e) {
    n(this, "dbname", "bitbox");
    n(this, "namespace");
    this.namespace = e;
  }
  open(e) {
    return new Promise((s, t) => {
      const r = u.indexedDB.open(this.dbname, e);
      r.onerror = (o) => {
        t(o);
      }, r.onsuccess = () => {
        s(r.result);
      }, r.onupgradeneeded = (o) => {
        const a = o.target.result, h = a.createObjectStore(this.namespace, { keyPath: "key" });
        h.transaction.oncomplete = () => {
          s(a);
        };
      };
    });
  }
  get db() {
    return this.open().then((e) => (e.objectStoreNames || []).contains(this.namespace) ? e : this.open(e.version + 1));
  }
  clear() {
    return new Promise(async (e, s) => {
      const r = (await this.db).transaction([this.namespace], "readwrite").objectStore(this.namespace).clear();
      r.onsuccess = () => {
        e();
      }, r.onerror = (o) => {
        s(o);
      };
    });
  }
  delete(e) {
    return new Promise(async (s, t) => {
      const o = (await this.db).transaction([this.namespace], "readwrite").objectStore(this.namespace).delete(e);
      o.onsuccess = () => {
        s();
      }, o.onerror = (a) => {
        t(a);
      };
    });
  }
  destroy() {
    return new Promise(async (e, s) => {
      const t = await this.open(), r = u.indexedDB.open(this.dbname, t.version + 1);
      r.onerror = (o) => {
        s(o);
      }, r.onupgradeneeded = () => {
        r.result.deleteObjectStore(this.namespace), e();
      };
    });
  }
  exists(e) {
    return this.get(e).then((s) => !!s);
  }
  get(e) {
    return new Promise(async (s, t) => {
      const o = (await this.db).transaction(this.namespace, "readonly").objectStore(this.namespace).get(e);
      o.onsuccess = () => {
        var a;
        s((a = o.result) == null ? void 0 : a.value);
      }, o.onerror = (a) => {
        t(a);
      };
    });
  }
  static get isSupported() {
    return !!this.indexedDB;
  }
  get keys() {
    return new Promise(async (e, s) => {
      const r = (await this.db).transaction(this.namespace, "readonly").objectStore(this.namespace).getAllKeys();
      r.onsuccess = () => {
        e(r.result);
      }, r.onerror = (o) => {
        s(o);
      };
    });
  }
  set(e, s) {
    return new Promise(async (t, r) => {
      const a = (await this.db).transaction([this.namespace], "readwrite").objectStore(this.namespace).put({
        key: e,
        value: s
      });
      a.onsuccess = () => {
        t();
      }, a.onerror = (h) => {
        r(h);
      };
    });
  }
  get size() {
    return new Promise(async (e, s) => {
      const r = (await this.db).transaction(this.namespace, "readonly").objectStore(this.namespace).count();
      r.onsuccess = () => {
        e(r.result);
      }, r.onerror = (o) => {
        s(o);
      };
    });
  }
};
n(u, "indexedDB", window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB);
let d = u;
class p {
  constructor(e, s) {
    n(this, "namespace");
    n(this, "storage");
    this.namespace = e, this.storage = window[s];
  }
  clear() {
    return this.storage.clear(), Promise.resolve();
  }
  delete(e) {
    return this.storage.removeItem(`${this.namespace}.${e}`), Promise.resolve();
  }
  destroy() {
    return this.clear(), Promise.resolve();
  }
  exists(e) {
    return Promise.resolve(Object.keys(this.storage).includes(`${this.namespace}.${e}`));
  }
  get(e) {
    const s = this.storage.getItem(`${this.namespace}.${e}`);
    return Promise.resolve(s && JSON.parse(s));
  }
  get keys() {
    return Promise.resolve(Object.keys(this.storage).filter((e) => e.startsWith(`${this.namespace}.`)).map((e) => e.replace(`${this.namespace}.`, "")));
  }
  set(e, s) {
    return this.storage.setItem(`${this.namespace}.${e}`, JSON.stringify(s)), Promise.resolve();
  }
  get size() {
    return Promise.resolve(Object.keys(this.storage).filter((e) => e.startsWith(`${this.namespace}.`)).length);
  }
}
class b extends p {
  constructor(e) {
    super(e, "localStorage");
  }
  static get isSupported() {
    return !!window.localStorage;
  }
}
class l extends p {
  constructor(e) {
    super(e, "sessionStorage");
  }
  static get isSupported() {
    return !!window.sessionStorage;
  }
}
class S {
  constructor(e, s = c.IndexedDB) {
    n(this, "store");
    n(this, "namespace");
    switch (this.namespace = e, !0) {
      case (s === c.IndexedDB && d.isSupported):
        console.log("IndexedDB is supported"), this.store = new d(this.namespace);
        break;
      case (s === c.SessionStorage && l.isSupported):
        console.log("SessionStorage is supported"), this.store = new l(this.namespace);
        break;
      case (s === c.LocalStorage && b.isSupported):
      default:
        console.log("LocalStorage is supported"), this.store = new b(this.namespace);
        break;
    }
  }
  clear() {
    return this.store.clear();
  }
  delete(e) {
    return this.store.delete(e);
  }
  destroy() {
    return this.store.destroy();
  }
  get(e) {
    return this.store.get(e);
  }
  exists(e) {
    return this.store.exists(e);
  }
  get keys() {
    return this.store.keys;
  }
  set(e, s) {
    return this.store.set(e, s);
  }
  get size() {
    return this.store.size;
  }
}
const x = (i) => new Promise((e) => setTimeout(e, i));
class P {
  constructor(e = "default", s = {}) {
    n(this, "namespace");
    n(this, "options");
    n(this, "pubsub");
    n(this, "store");
    const t = {
      immutable: !1,
      retry: !1,
      ttl: void 0,
      storage: c.IndexedDB
    };
    this.namespace = e, this.options = Object.assign({}, t, s), this.pubsub = new w(), this.store = new S(this.namespace, this.options.storage);
  }
  async clear() {
    const e = await this.store.keys;
    await this.store.clear(), e.forEach((s) => this.pubsub.publish(s, void 0));
  }
  async destroy() {
    await this.store.destroy();
  }
  async delete(e) {
    await this.store.delete(e), this.pubsub.publish(e, void 0);
  }
  exists(e) {
    return this.store.exists(e);
  }
  async get(e, s) {
    let t = 0, r, o;
    s = s || this.options.retry;
    do
      t > 0 && await x(s.interval), { value: r, ttl: o } = await this.store.get(e) || {};
    while (!r && s && s.attempts > t++);
    if (o && o < Date.now()) {
      await this.delete(e);
      return;
    }
    return r;
  }
  get keys() {
    return this.store.keys;
  }
  async set(e, s, t) {
    return t = t || this.options.ttl, this.options.immutable && await this.exists(e) ? Promise.reject("This Bitbox instance is immutable and cannot be set.") : (this.store.set(e, {
      value: s,
      ttl: t && Date.now() + t
    }), this.pubsub.publish(e, s), Promise.resolve());
  }
  get size() {
    return this.store.size;
  }
  subscribe(e, s) {
    return this.pubsub.subscribe(e, s);
  }
  unsubscribe(e, s) {
    this.pubsub.unsubscribe(e, s);
  }
}
export {
  c as StorageType,
  P as default
};

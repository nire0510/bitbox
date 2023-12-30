import PubSub from './services/pubsub';
import Store from './services/store';
import wait from './utils/wait';
import { StorageType } from './types/storage-type';

export { StorageType };

export default class Bitbox {
  namespace:string;
  options:StoreOptions;
  pubsub:PubSub;
  store:Store;

  constructor(namespace='default', options:StoreOptions={} as StoreOptions) {
    const defaults = {
      immutable: false,
      retry: false,
      ttl: undefined,
      storage: StorageType.IndexedDB,
    } as StoreOptions;

    this.namespace = namespace;    
    this.options = Object.assign({}, defaults, options);
    this.pubsub = new PubSub();
    this.store = new Store(this.namespace, this.options.storage);
  }

  async clear(): Promise<void> {
    const keys = await this.store.keys;

    await this.store.clear();
    keys.forEach((key:string) => this.pubsub.publish(key, undefined));
  }

  async destroy(): Promise<void> {
    await this.store.destroy();
  }

  async delete(key:string): Promise<void> {
    await this.store.delete(key);
    this.pubsub.publish(key, undefined);
  }

  exists(key:string): Promise<boolean> {
    return this.store.exists(key);
  }

  async get(key:string, fallback?: any, retry?: Retry): Promise<any> {
    let retries = 0;
    let value: unknown;
    let ttl: number;

    retry = retry || this.options.retry as Retry;
    do {
      retries > 0 && await wait(retry.interval);
      ({ value, ttl } = await this.store.get(key) || {}) as Promise<{ value: any; ttl: number; }>;
    } while (!value && retry && retry.attempts > retries++);

    if (ttl && ttl < Date.now()) {
      await this.delete(key);
      return undefined;
    }

    if (!value && fallback) {
      value = typeof fallback === 'function' ?
        await Promise.resolve(fallback()) :
        fallback;
    }

    return value;
  }

  get keys(): Promise<string[]> {
    return this.store.keys;
  }

  async set(key:string, value:any, ttl?: number): Promise<void> {
    ttl = ttl || this.options.ttl;
    if (this.options.immutable && await this.exists(key)) {
      return Promise.reject('This Bitbox instance is immutable and cannot be set.');
    }
    this.store.set(key, {
      value,
      ttl: ttl && Date.now() + ttl,
    });
    this.pubsub.publish(key, value);

    return Promise.resolve();
  }

  get size(): Promise<number> {
    return this.store.size;
  }

  subscribe(key:string, callback:Function): string {
    return this.pubsub.subscribe(key, callback);
  }

  unsubscribe(key:string, id:string): void {
    this.pubsub.unsubscribe(key, id);
  }
}

import IStore from './istore';

export default class LSStorage implements IStore {
  namespace: string;
  storage: Storage;

  constructor(namespace:string, storage: 'localStorage' | 'sessionStorage') {
    this.namespace = namespace;
    this.storage = window[storage];
  }

  clear(): Promise<void> {
    this.storage.clear();

    return Promise.resolve();
  };

  delete(key:string): Promise<void> {
    this.storage.removeItem(`${this.namespace}.${key}`);

    return Promise.resolve();
  };

  destroy(): Promise<void> {
    this.clear();

    return Promise.resolve();
  };

  exists(key:string): Promise<boolean> {
    return Promise.resolve(Object.keys(this.storage).includes(`${this.namespace}.${key}`));
  };

  get(key:string): Promise<any> {
    const item = this.storage.getItem(`${this.namespace}.${key}`);

    return Promise.resolve(item && JSON.parse(item));
  }

  get keys(): Promise<string[]> {
    return Promise.resolve(Object.keys(this.storage).filter((key:string) => key.startsWith(`${this.namespace}.`)).map((key:string) => key.replace(`${this.namespace}.`, '')));
  }

  set(key:string, value:any): Promise<void> {
    this.storage.setItem(`${this.namespace}.${key}`, JSON.stringify(value));

    return Promise.resolve();
  };

  get size(): Promise<number> {
    return Promise.resolve(Object.keys(this.storage).filter((key:string) => key.startsWith(`${this.namespace}.`)).length);
  }
}

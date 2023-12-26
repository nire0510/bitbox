import { StorageType } from '../../types/storage-type';
import IndexedDB from './indexeddb';
import LocalStorage from './localstorage';
import SessionStorage from './sessionstorage';

export default class Store {
  store: IndexedDB | LocalStorage;
  namespace: string;

  constructor(namespace:string, type:StorageType=StorageType.IndexedDB) {
    this.namespace = namespace;
    switch (true) {
      case type === StorageType.IndexedDB && IndexedDB.isSupported:
        console.log('IndexedDB is supported');
        this.store = new IndexedDB(this.namespace);
        break;
      case type === StorageType.SessionStorage && SessionStorage.isSupported:
        console.log('SessionStorage is supported');
        this.store = new SessionStorage(this.namespace);
        break;
      case type === StorageType.LocalStorage && LocalStorage.isSupported:
      default:
        console.log('LocalStorage is supported');
        this.store = new LocalStorage(this.namespace);
        break;
    }
  }

  clear(): Promise<void> {
    return this.store.clear();
  }

  delete(key:string): Promise<void> {
    return this.store.delete(key);
  }

  destroy(): Promise<void> {
    return this.store.destroy();
  }

  get(key:string): Promise<any> {
    return this.store.get(key);
  }

  exists(key:string): Promise<boolean> {
    return this.store.exists(key);
  }

  get keys(): Promise<string[]> {
    return this.store.keys;
  }

  set(key:string, value:any): Promise<void> {
    return this.store.set(key, value);
  }

  get size(): Promise<number> {
    return this.store.size;
  }
}

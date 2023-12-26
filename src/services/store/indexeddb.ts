import IStore from './istore';

export default class IndexedDB implements IStore {
  static indexedDB: any = window.indexedDB || (window as any).mozIndexedDB || (window as any).webkitIndexedDB || (window as any).msIndexedDB || (window as any).shimIndexedDB;
  dbname: string = 'bitbox';
  namespace: string;

  constructor(namespace:string) {
    this.namespace = namespace;
  }

  private open(version?:number): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = IndexedDB.indexedDB.open(this.dbname, version);

      request.onerror = (event: Event) => {
        reject(event);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event!.target as any).result;
        const objectStore = db.createObjectStore(this.namespace, { keyPath: 'key' });

        objectStore.transaction.oncomplete = () => {
          resolve(db);
        }
      };
    });
  }

  get db(): Promise<any> {
    return this.open()
      .then((db:any) => {
        if (!((db.objectStoreNames || []).contains(this.namespace))) {
          return this.open(db.version + 1);
        }

        return db;
      });
  }

  clear(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const db = await this.db;
      const request = db.transaction([this.namespace], 'readwrite')
        .objectStore(this.namespace)
        .clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (error:Error) => {
        reject(error);
      };
    });
  }

  delete(key:string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const db = await this.db;
      const request = db.transaction([this.namespace], 'readwrite')
        .objectStore(this.namespace)
        .delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (error:Error) => {
        reject(error);
      };
    });
  }

  destroy(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const db = await this.open();
      const request = IndexedDB.indexedDB.open(this.dbname, db.version + 1);

      request.onerror = (error:Error) => {
        reject(error);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        
        db.deleteObjectStore(this.namespace);
        resolve();
      };
    });
  }

  exists(key:string): Promise<boolean> {
    return this.get(key).then((value:any) => !!value);
  }

  get(key:string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const db = await this.db;
      const request = db.transaction(this.namespace, 'readonly')
        .objectStore(this.namespace)
        .get(key);

      request.onsuccess = () => {
        resolve(request.result?.value);
      };

      request.onerror = (error:Error) => {
        reject(error);
      };
    });
  }

  static get isSupported(): boolean {
    return !!this.indexedDB;
  }

  get keys(): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      const db = await this.db;
      const request = db.transaction(this.namespace, 'readonly')
        .objectStore(this.namespace)
        .getAllKeys();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (error:Error) => {
        reject(error);
      };
    });
  }

  set(key:string, value:any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const db = await this.db;
      const request = db.transaction([this.namespace], 'readwrite')
        .objectStore(this.namespace)
        .put({
          key,
          value,
        });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (error:Error) => {
        reject(error);
      };
    });
  }

  get size(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const db = await this.db;
      const request = db.transaction(this.namespace, 'readonly')
        .objectStore(this.namespace)
        .count();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (error:Error) => {
        reject(error);
      };
    });
  }
}

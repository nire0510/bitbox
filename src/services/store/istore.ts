export default interface Store {
  clear(): Promise<void>;
  delete(name: string): Promise<void>;
  destroy(): Promise<void>;
  exists(name: string): Promise<boolean>;
  get(name: string): any;
  set(name: string, value: any): Promise<void>;
  size: Promise<number>;
  keys: Promise<string[]>;
}

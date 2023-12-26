import LSStorage from './lsstorage';

export default class LocalStorage extends LSStorage {
  constructor(namespace:string) {
    super(namespace, 'localStorage');
  }

  static get isSupported(): boolean {
    return !!window.localStorage;
  }
}

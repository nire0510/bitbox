import LSStorage from './lsstorage';

export default class SessionStorage extends LSStorage {
  constructor(namespace:string) {
    super(namespace, 'sessionStorage');
  }

  static get isSupported(): boolean {
    return !!window.sessionStorage;
  }
}

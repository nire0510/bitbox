import { afterEach, describe, expect, test } from 'vitest';
import Bitbox, { StorageType } from '../../src/main';
import wait from '../../src/utils/wait';

describe('Bitbox', () => {
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('namespace', () => {
    test('default namespace should be `default`', () => {
      const bitbox = new Bitbox();

      expect(bitbox.namespace).toBe('default');
    });

    test('predefined namespace should be `mystore`', () => {
      const bitbox = new Bitbox('mystore');

      expect(bitbox.namespace).toBe('mystore');
    });
  });

  describe('options', () => {
    describe('storage', () => {
      test('keys should be stored in the localStorage', async () => {
        const bitbox = new Bitbox('default', {
          storage: StorageType.LocalStorage,
        });
        
        expect(Object.keys(localStorage).length).toBe(0);
        await bitbox.set('foo', 'bar');
        expect(Object.keys(localStorage).length).toBe(1);
        expect(Object.keys(sessionStorage).length).toBe(0);
        expect(localStorage.getItem('default.foo')).toBe('{"value":"bar"}');
      });

      test('keys should be stored in the sessionStorage', async () => {
        const bitbox = new Bitbox('default', {
          storage: StorageType.SessionStorage,
        });
        
        expect(Object.keys(sessionStorage).length).toBe(0);
        await bitbox.set('foo', 'bar');
        expect(Object.keys(sessionStorage).length).toBe(1);
        expect(Object.keys(localStorage).length).toBe(0);
        expect(sessionStorage.getItem('default.foo')).toBe('{"value":"bar"}');
      });
    });

    describe('immutable', () => {
      test('key should be immutable if immutable is set', async () => {
        const bitbox = new Bitbox('default', {
          immutable: true,
        });
        
        await bitbox.set('foo', 'bar');
        expect(await bitbox.get('foo')).toBe('bar');
        await expect(() => bitbox.set('foo', 'qux')).rejects.toThrow('This Bitbox instance is immutable and cannot be set.');
        expect(await bitbox.get('foo')).toBe('bar');
      });

      test('key should be mutable if immutable is not set', async () => {
        const bitbox = new Bitbox();
        
        await bitbox.set('foo', 'bar');
        expect(await bitbox.get('foo')).toBe('bar');
        await bitbox.set('foo', 'qux');
        expect(await bitbox.get('foo')).toBe('qux');
      });
    });

    describe('ttl', () => {
      test('key should exist forever if ttl is not set', async () => {
        const bitbox = new Bitbox();
        
        await bitbox.set('foo', 'bar');
        await wait(1000);
        expect(await bitbox.get('foo')).toBe('bar');
        await wait(5000);
        expect(await bitbox.get('foo')).toBe('bar');
      });

      test('key should be undefined ttl is set', async () => {
        const bitbox = new Bitbox('default', {
          ttl: 5000,
        });
        
        await bitbox.set('foo', 'bar');
        expect(await bitbox.get('foo')).toBe('bar');
        await wait(1000);
        expect(await bitbox.get('foo')).toBe('bar');
        await wait(5000);
        expect(await bitbox.get('foo')).toBeUndefined();
      });
    });

    describe('retry', () => {
      test('value should be undefined if key & retry is not set', async () => {
        const bitbox = new Bitbox();
        
        expect(await bitbox.get('foo')).toBeUndefined();
        await wait(5000);
        expect(await bitbox.get('foo')).toBeUndefined();
      });

      test('value should return if key is not set initially but the retry is set', async () => {
        const bitbox = new Bitbox('default', {
          retry: {
            interval: 1000,
            attempts: 5,
          },
        });
        
        setTimeout(async () => {
          await bitbox.set('foo', 'bar');
        }, 3000);
        expect(await bitbox.get('foo')).toBe('bar');
      });

      test('value should be undefined if key is not set initially, the retry is set but for shorter time', async () => {
        const bitbox = new Bitbox('default', {
          retry: {
            interval: 1000,
            attempts: 3,
          },
        });
        
        setTimeout(async () => {
          await bitbox.set('foo', 'bar');
        }, 5000);
        expect(await bitbox.get('foo')).toBeUndefined();
      });
    });
  });

  describe('complete simple scenario', () => {
    test('initial size should be 0', async () => {
      const bitbox = new Bitbox();
      // const bitbox = new Bitbox('default', {
      //   storage: StorageType.SessionStorage,
      // });
      
      expect(await bitbox.size).toBe(0);
    });

    test('foo key should be equal to `bar` and exists be true', async () => {
      const bitbox = new Bitbox();

      await bitbox.set('foo', 'bar');
      expect(await bitbox.get('foo')).toBe('bar');
      expect(await bitbox.exists('foo')).toBeTruthy();
    });

    test('non existing ket should be equal to undefined and exists be false', async () => {
      const bitbox = new Bitbox();
      
      expect(await bitbox.get('foo')).toBeUndefined();
      expect(await bitbox.exists('foo')).toBeFalsy();
    });

    test('size and keys should return the actual number of keys and delete should remove existing keys', async () => {
      const bitbox = new Bitbox();

      expect(await bitbox.size).toBe(0);
      expect((await bitbox.keys).length).toBe(0);
      await bitbox.set('foo', 'bar');
      expect(await bitbox.size).toBe(1);
      expect((await bitbox.keys).length).toBe(1);
      expect((await bitbox.keys)[0]).toBe('foo');
      await bitbox.set('baz', 'qux');
      expect(await bitbox.size).toBe(2);
      expect((await bitbox.keys).length).toBe(2);
      expect((await bitbox.keys)[0]).toBe('foo');
      expect((await bitbox.keys)[1]).toBe('baz');
      await bitbox.delete('nonexisting');
      expect(await bitbox.size).toBe(2);
      expect((await bitbox.keys).length).toBe(2);
      expect((await bitbox.keys)[0]).toBe('foo');
      expect((await bitbox.keys)[1]).toBe('baz');
      await bitbox.delete('baz');
      expect(await bitbox.size).toBe(1);
      expect((await bitbox.keys).length).toBe(1);
      expect((await bitbox.keys)[0]).toBe('foo');
    });
  });

  test('clear should remove all keys', async () => {
    const bitbox = new Bitbox();
    
    expect(await bitbox.size).toBe(0);
    await bitbox.clear();
    expect(await bitbox.size).toBe(0);
    await bitbox.set('foo', 'bar');
    await bitbox.set('baz', 'qux');
    expect(await bitbox.size).toBe(2);
    await bitbox.clear();
    expect(await bitbox.size).toBe(0);
  });

  test('destroy should remove all keys', async () => {
    const bitbox = new Bitbox();
    
    expect(await bitbox.size).toBe(0);
    await bitbox.clear();
    expect(await bitbox.size).toBe(0);
    await bitbox.set('foo', 'bar');
    await bitbox.set('baz', 'qux');
    expect(await bitbox.size).toBe(2);
    await bitbox.destroy();
    expect(await bitbox.size).toBe(0);
  });

  test('subscribe should trigger callback when a value is changed', async () => {
    const bitbox = new Bitbox();
    
    await bitbox.set('foo', 'bar');
    expect(await bitbox.get('foo')).toBe('bar');
    const subscriberId = bitbox.subscribe('foo', (value: any) => {
      console.count(`Change event published for foo! foo equals now to: ${value}`);
      expect(value).toBe('qux');
    });
    await bitbox.set('foo', 'qux');
    expect(await bitbox.get('foo')).toBe('qux');
    await bitbox.unsubscribe('foo', subscriberId);
    await bitbox.set('foo', 'bar');
    expect(await bitbox.get('foo')).toBe('bar');
  });
});

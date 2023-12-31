# Bitbox
A simple storage for your browser based applications bits and bytes.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Description

Introducing Bitbox: The JavaScript Library That Unifies and Supercharges HTML5 Storage.

Effortlessly Manage LocalStorage, SessionStorage, and IndexedDB with a Simple, Powerful API.

Bitbox revolutionizes the way you interact with HTML5 storage mechanisms by offering a streamlined, intuitive API that works seamlessly across LocalStorage, SessionStorage, and IndexedDB. It eliminates the need for disparate code and equips you with advanced features to enhance your web applications.

## Key Features:

* **Unified API**: Interact with all three storage mechanisms using a single, consistent syntax, simplifying your code and reducing complexity.

* **Property Subscriptions**: Stay informed of changes to stored values in real-time by subscribing to specific properties. Build dynamic and responsive applications that react to user actions and data updates effortlessly.

* **Time-to-Live (TTL) for Properties**: Set expiration dates for stored properties, ensuring automatic removal and efficient data management. Optimize storage usage and keep your applications clutter-free.

* **Seamless Integration**: Integrate Bitbox effortlessly into your existing projects without significant code changes.

* **Lightweight and Efficient**: Experience minimal overhead with a library designed for performance and optimized for real-world use cases.

## Unlock New Possibilities
* Build offline-first applications: Store and retrieve data even when offline, providing a seamless user experience regardless of network connectivity.
* Create real-time collaborative features: Implement features like live chat or collaborative document editing with property subscriptions.
* Implement efficient caching strategies: Optimize performance and reduce server load by caching data locally with TTL support.
* Store complex data structures: Manage large datasets and complex objects effectively using IndexedDB's advanced capabilities.

**Supercharge Your Web Development Today** Bitbox is the ultimate solution for simplifying and enhancing HTML5 storage in your web applications. Experience the power of a unified API, advanced features, and seamless integration with this groundbreaking library.

Get started now and discover the possibilities!


## Installation

You can install the library using npm:  
`npm i @nire0510/bitbox`

## Usage
```javascript
import Bitbox from '@nire0510/bitbox';

async function main() {
  const bitbox = new Bitbox();

  // add or modify a property:
  await bitbox.set('bla', { foo: 'bar', baz: 1 });
  // read the value of the property:
  const value = await bitbox.get('bla');
}
```

## API:

### Constructor:  

1. `const bitbox = new Bitbox();`  
1. `const bitbox = new Bitbox('namescape')`  
1. `const bitbox = new Bitbox('namescape', options);`  

#### namespace (string):
The namespace is the logical name of your store. While it is not mandatory, you will have to set it if you are going to change the default options (see next).

#### options (object):
* `immutable` boolean:  
  * `false` (default) - existing value can be modified.  
  * `true` - existing values cannot be modified.
* `retry` boolean | Retry:  
  * `false` (default) - if a key cannot be found, return undefined.
  * `retry` object:  
    * `attempts` - maximum number of retries if a key cannot be found.
    * `interval` - time in milliseconds between attempts.  
    if a key cannot be found, wait for it before giving up and returning undefined.
* `ttl` number | undefined - time in milliseconds that keys should be kept. After that, key will be evacuated and undefined is returned.
* `storage` string:  
  * `StorageType.IndexedDB` (default) - Use IndexedDB.
  * `StorageType.LocalStorage` - Use LocalStorage.
  * `StorageType.SessionStorage` - Use SessionStorage.  
  (make sure to import the `StorageType` enum).

None of the options above is mandatory. You may specify all, some or none of them.

### Methods:  

#### `clear(): Promise<void>`
Remove all keys.  
`await bitbox.clear();`  

#### `delete(key:string): Promise<void>`
Remove an existing key.  
`await bitbox.delete('foo');`  

#### `exists(key:string): Promise<boolean>`
Check if a key already exists.  
`const exists = await bitbox.exists('foo');`  

#### `get(key:string, fallback?:any, retry?:Retry): Promise<any>`
Retrieve the value of a key.  
If a fallback is defined, it will be evaluated if it's a function and returned in case the key could not be found or has expired (note that it doesn't set the key's value).  
If `retry` parameter is set (see [options](#options) section), it overrides the store's similar setting.  
```javascript
// basic get:
const value = await bitbox.get('foo');
// get with fallback (variable):
const value = await bitbox.get('foo', 'bar');
// get with fallback (function):
const value = await bitbox.get('foo', () => 'bar');
// get with fallback (promise):
const value = await bitbox.get('foo', () => new Promise((resolve) => window.setTimeout(() => 'bar', 5000)));
// get with retry:
const value = await bitbox.get('foo', undefined, {
  interval: 1000,
  attempts: 4,
});
// get with fallback & retry:
const value = await bitbox.get('foo', 'bar', {
  interval: 1000,
  attempts: 4,
});
```

#### `keys: Promise<Array<string>>`
Get all existing keys.  
`const keys = await bitbox.keys;`  

#### `set(key:string, value:any, ttl?:number): Promise<void>`
Add a new key or modify* an existing one.  
(* if immutable option set to true, modifying an existing key will throw an error).  
If `ttl` object is set (see [options](#options) section), it overrides the store's similar setting.  
```javascript
// basic set:
await bitbox.set('foo', 'bar');
// set with 2 hours ttl:
await bitbox.set('foo', 'bar', 1000 * 60 * 60 * 2);
```

#### `size: Promise<number>`
Get the number of existing keys.  
`const size = await bitbox.size;`  

#### `subscribe(key:string, callback: Function): Promise<string>`
Call a function every time a value of an existing key is changed;  
```javascript
const subscriptionId = await bitbox.subscribe('foo', (value) => {
  console.log('foo value has just changed to', value);
});
```

#### `unsubscribe(key:string, subscription: string): Promise<void>`
Disable previous subscription and stop being notified on value changes.  
`await bitbox.unsubscribe('foo', subscriptionId);`  

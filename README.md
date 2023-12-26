# Bitbox
A simple storage for your bits and bytes.

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
  // or set your options:
  // const bitbox = new Bitbox({ ... });

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

#### `delete(key:string): Promise<void>`

#### `exists(key:string): Promise<boolean>`

#### `get(key:string): Promise<any>`

#### `keys: Promise<Array<string>>`

#### `set(key:string, value): Promise<void>`

#### `size: Promise<number>`

#### `subscribe(key:string, callback: Function): Promise<string>`

#### `unsubscribe(key:string, subscription: string): Promise<void>`


export default class PubSub {
  private subscribers: { [event: string]: { [id: string]: Function; } };

  constructor() {
    this.subscribers = {};
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  publish(event:string, ...args:any[]): void {
    const eventSubscribers = this.subscribers[event];

    this.subscribers[event] && Object.keys(eventSubscribers).forEach((id) => {
      eventSubscribers[id](...args);
    });
  }

  subscribe(event:string, callback:Function): string {
    const id = this.generateId();

    if (!this.subscribers[event]) {
      this.subscribers[event] = {};
    }
    this.subscribers[event][id] = callback;

    return id;
  }

  unsubscribe(event:string, id:string): void {
    delete this.subscribers[event]?.[id];
  }
}

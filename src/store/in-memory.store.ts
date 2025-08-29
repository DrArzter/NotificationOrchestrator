export class InMemoryStore<T> {
  private readonly store: Map<string, T>;

  constructor() {
    this.store = new Map<string, T>();
  }

  get(key: string): T | undefined {
    return this.store.get(key);
  }

  set(key: string, value: T): void {
    this.store.set(key, value);
  }
}
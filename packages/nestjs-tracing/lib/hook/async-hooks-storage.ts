/**
 * Created by Rain on 2020/7/20
 */
export class AsyncHooksStorage {
  constructor(private readonly asyncStorage = new Map<number, unknown>()) {
    this.initialize();
  }

  get<T = any>(triggerId: number): T {
    return this.asyncStorage.get(triggerId) as T;
  }

  has(triggerId: number): boolean {
    return this.asyncStorage.has(triggerId);
  }

  inherit(asyncId: number, triggerId: number): void {
    const value = this.asyncStorage.get(triggerId);
    this.asyncStorage.set(asyncId, value);
  }

  delete(asyncId: number): void {
    this.asyncStorage.delete(asyncId);
  }

  getInternalStorage(): Map<number, unknown> {
    return this.asyncStorage;
  }

  private initialize() {
    const initialAsyncId = 1;
    this.asyncStorage.set(initialAsyncId, new Map());
  }
}

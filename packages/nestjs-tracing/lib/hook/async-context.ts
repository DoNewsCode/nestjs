/**
 * Created by Rain on 2020/7/20
 */
import * as asyncHooks from 'async_hooks';

import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { AsyncHooksHelper } from './async-hooks-helper';
import { AsyncHooksStorage } from './async-hooks-storage';

export class AsyncContext implements OnModuleInit, OnModuleDestroy {
  private static _instance: AsyncContext;

  private constructor(
    private readonly internalStorage: Map<number, any>,
    private readonly asyncHookRef: asyncHooks.AsyncHook,
  ) {}

  static getInstance(): AsyncContext {
    if (!this._instance) {
      this.initialize();
    }
    return this._instance;
  }

  onModuleInit(): void {
    this.asyncHookRef.enable();
  }

  onModuleDestroy(): void {
    this.asyncHookRef.disable();
  }

  set<TKey = any, TValue = any>(key: TKey, value: TValue): void {
    const store = this.getAsyncStorage();
    store.set(key, value);
  }

  get<TKey = any, TReturnValue = any>(key: TKey): TReturnValue {
    const store = this.getAsyncStorage();
    return store.get(key) as TReturnValue;
  }

  run(fn: (...args: any) => any): any {
    const eid = asyncHooks.executionAsyncId();
    this.internalStorage.set(eid, new Map());
    return fn();
  }

  private getAsyncStorage(): Map<unknown, unknown> {
    const eid = asyncHooks.executionAsyncId();
    const state = this.internalStorage.get(eid);
    if (!state) {
      throw new Error(
        `Async ID (${eid}) is not registered within internal cache.`,
      );
    }
    return state;
  }

  private static initialize() {
    const asyncHooksStorage = new AsyncHooksStorage();
    const asyncHook = AsyncHooksHelper.createHooks(asyncHooksStorage);
    const storage = asyncHooksStorage.getInternalStorage();

    this._instance = new AsyncContext(storage, asyncHook);
  }
}

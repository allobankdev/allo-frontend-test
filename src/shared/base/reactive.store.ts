import {
  reactive,
  computed,
  type ComputedRef,
  type UnwrapNestedRefs,
} from "vue";

export class ReactiveStore<T extends object> {
  protected readonly state: UnwrapNestedRefs<T>;

  constructor(initialState: T) {
    this.state = reactive(initialState) as UnwrapNestedRefs<T>;
  }

  select<K extends keyof T>(key: K): ComputedRef<T[K]> {
    return computed(() => (this.state as any)[key] as T[K]);
  }

  set<K extends keyof T>(key: K, data: T[K]): void {
    (this.state as any)[key] = data;
  }

  setState(partialState: Partial<T>): void {
    Object.assign(this.state, partialState);
  }

  getState(): T {
    return this.state as T;
  }

  resetState(initialState: T): void {
    Object.assign(this.state, initialState);
  }
}

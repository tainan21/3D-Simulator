export type StoreListener<T> = (state: T) => void;
export type StoreUpdater<T> = T | ((current: T) => T);

export type Store<T> = Readonly<{
  getState: () => T;
  setState: (updater: StoreUpdater<T>) => T;
  subscribe: (listener: StoreListener<T>) => () => void;
}>;

export function createStore<T>(initialState: T): Store<T> {
  let state = initialState;
  const listeners = new Set<StoreListener<T>>();

  return {
    getState: () => state,
    setState: (updater) => {
      state = typeof updater === "function" ? (updater as (current: T) => T)(state) : updater;
      listeners.forEach((listener) => listener(state));
      return state;
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
}

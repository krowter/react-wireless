import { useSyncExternalStore } from "react";

export function createSource(defaultValue) {
  const store = createStore(defaultValue);

  return () => {
    const state = useSyncExternalStore(store.subscribe, store.get);

    return [state, store.set];
  };
}

function createStore(defaultValue) {
  let store = defaultValue;

  const subscribers = new Set();

  function subscribe(subscriberFn) {
    subscribers.add(subscriberFn);

    return () => subscribers.delete(subscriberFn);
  }

  function setter(newValue) {
    if (typeof newValue === "function") {
      store = newValue(store);
    } else {
      store = newValue;
    }

    subscribers.forEach((fn) => fn(store));
  }

  return {
    get: () => store,
    set: setter,
    subscribe,
  };
}

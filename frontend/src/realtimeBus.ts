const listeners = new Set();

export function publishRealtimeAction(action) {
  for (const listener of listeners) listener(action);
}

export function subscribeRealtimeActions(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

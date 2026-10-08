/** One generation at a time: WebLLM's engine handles a single request stream. */
export function createRunLock() {
  let isBusy = false;
  const listeners = [];
  const notify = () => listeners.forEach((fn) => fn(isBusy));
  return {
    acquire() {
      if (isBusy) return false;
      isBusy = true;
      notify();
      return true;
    },
    release() {
      if (!isBusy) return;
      isBusy = false;
      notify();
    },
    busy: () => isBusy,
    subscribe(fn) {
      listeners.push(fn);
    },
  };
}

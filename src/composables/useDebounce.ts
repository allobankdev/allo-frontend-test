export function useDebounce<
  T extends (...args: Parameters<T>) => ReturnType<T>,
>(fn: T, delay: number = 500) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

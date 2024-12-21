type AnyFunction = (...args: any[]) => any;

export function debounce<T extends AnyFunction>(
  func: T,
  wait: number,
  options: { leading?: boolean } = {}
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const debouncedFn = (...args: Parameters<T>): void => {
    lastArgs = args;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (options.leading && !timeoutId) {
      func.apply(null, args);
    }

    timeoutId = setTimeout(() => {
      if (lastArgs && !options.leading) {
        func.apply(null, lastArgs);
      }
      timeoutId = null;
      lastArgs = null;
    }, wait);
  };

  return debouncedFn;
}
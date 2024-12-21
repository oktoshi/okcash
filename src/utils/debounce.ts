type DebouncedFunction<T extends (...args: unknown[]) => unknown> = (...args: Parameters<T>) => void;

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options: { leading?: boolean } = {}
): DebouncedFunction<T> {
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
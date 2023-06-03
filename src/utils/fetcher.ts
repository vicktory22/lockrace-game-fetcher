type FetcherOptions = RequestInit & {
  timeout?: number;
};

export const fetchWithTimeout = async (url: string, options: FetcherOptions = {}) => {
  const { timeout = 800 } = options;

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    /* c8 ignore next */
    controller.abort();
  }, timeout);

  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  return response;
};

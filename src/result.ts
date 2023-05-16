/* c8 ignore start */
export type Result<T, E = unknown> = [T, undefined] | [undefined, E];

export const Ok = <T>(value: T): [T, undefined] => [value, undefined];

export const Err = <E>(error: E): [undefined, E] => [undefined, error];

export const encaseThrowable = <T>(throwableFn: () => T) => {
  try {
    return Ok(throwableFn());
  } catch (e) {
    return Err(e);
  }
};

export const encasePromise = async <T>(fn: Promise<T>) => {
  try {
    return Ok(await fn);
  } catch (e) {
    if (e instanceof Error) {
      return Err(e);
    }

    return Err(new Error("Unknown error", { cause: e }));
  }
};
/* c8 ignore stop */

export const to = <T>(
  promise: Promise<T>
): Promise<
  { result: T; error: undefined } | { result: undefined; error: Error }
> =>
  promise.then(
    (result: T) => ({
      result,
      error: undefined,
    }),
    (error: Error) => ({
      error,
      result: undefined,
    })
  );

// Various utilities

/**
 * Something which can either be `T` or an array or `T`
 */
export type MaybeArray<T> = T | T[];

/**
 * Converts a {@link MaybeArray} to an array
 * @param a The {@link MaybeArray}
 * @returns An array of `T`
 */
export const maybeArray = <T>(a: MaybeArray<T>): T[] =>
  Array.isArray(a) ? a : [a];

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

/**
 * Zips two arrays.
 * The shorter array's length will be the length of the result.
 *
 * @param l The left array to zip
 * @param r The right array to zip
 * @returns The zipped array (containing pairs of left and right input array)
 */
export const zip = <L, R>(l: L[], r: R[]): [L, R][] =>
  Array.from(Array(Math.min(l.length, r.length)), (_: any, i) => [l[i], r[i]]);

/**
 * Calculates the euclidean distance between two n-dimensional points.
 * Assumes both points to have the same dimension.
 *
 * @param a a n-dimensional point
 * @param a a n-dimensional point
 * @returns Distance between `a` and `b`
 */
export const distance = (a: number[], b: number[]): number =>
  Math.sqrt(
    zip(a, b)
      .map(([a, b]) => Math.pow(a - b, 2))
      .reduce((acc, val) => acc + val, 0),
  );

/**
 * Distribute an `Omit` over a union.
 *
 * See  https://stackoverflow.com/a/57103940
 *
 */
export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

/**
 * Stores the question answers in the local storage.
 * @param numbers The question answers to store.
 */
export const saveAnswersToLocalStorage = (numbers: number[]) => {
    const json = JSON.stringify(numbers);
    localStorage.setItem("question-answers", json);
}

/**
 * Retrieves question answers from the local storage if present.
 * @returns The question answers if any were stored, `undefined` otherwise.
 */
export const getAnswersFromLocalStorage = (): number[] | undefined => {
  try {
    const json = localStorage.getItem("question-answers");
    if (json === null) {
      return undefined;
    }

    const parsed = JSON.parse(json);
    return Array.isArray(parsed) && parsed.every(item => typeof item === "number") ? parsed : undefined;
  } catch (error) {
    return undefined;
  }
}

/**
 * Checks if something is a `number[]`
 *
 * @param value The thing to check
 * @returns `true` if it is a `number[]`, `false` otherwise.
 */
export const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === "number");

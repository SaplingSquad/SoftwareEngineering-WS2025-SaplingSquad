// Various utilities

import { isBrowser } from "@builder.io/qwik/build";
import { getTags } from "./api/api_methods.gen";

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
};

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
    return Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "number")
      ? parsed
      : undefined;
  } catch (error) {
    return undefined;
  }
};

/**
 * Gets the tag names corresponding to a list of tag numbers. Uses local storage as cache to avoid repeated requests.
 * @param tagNumbers The tag numbers to retrieve the names of.
 * @returns The tag names matching the tag numbers.
 */
export const getTagNames = async (tagNumbers: number[]): Promise<string[]> => {
  let allTags: {
    id: number;
    name: string;
  }[] = [];

  if (isBrowser) {
    try {
      const json = localStorage.getItem("tag-names");
      if (json !== null) {
        allTags = JSON.parse(json);
      }
    } catch (ignore) {
      /* ignore */
    }
  }

  if (allTags.length === 0) {
    await getTags().then((r) => {
      if (r.status === 200) {
        allTags = r.body;
      }
    });

    if (isBrowser) {
      localStorage.setItem("tag-names", JSON.stringify(allTags));
    }
  }

  return tagNumbers.map(
    (tagNr) => allTags.find((tag) => tag.id === tagNr)!.name,
  );
};

/**
 * Checks if something is a `number[]`
 *
 * @param value The thing to check
 * @returns `true` if it is a `number[]`, `false` otherwise.
 */
export const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === "number");

/**
 * Limits the `text` to a maximum of `limit` characters.
 * Will add `cont` to the end if the text was truncated.
 *
 * @param text input to limit
 * @param limit number of characters to limit to
 * @param cont continuation symbols to add if limited. Note that these do not count towards the limit.
 * @returns a limited string.
 */
export const limitText = (
  text: string,
  limit: number,
  cont: string = "...",
): string =>
  text.length <= limit ? text : text.substring(0, limit).trimEnd() + cont;

/**
 * Formats a number to a string.
 * Will return `undefined` iff the input is `undefined`.
 *
 * @param num number to format
 * @returns the string
 */
export const formatNumber = (num: number | undefined) =>
  num !== undefined ? num.toString() : num;

/**
 * Formats a `YYYY-MM`-date to `MM/YYYY`.
 * Allows arbitrary-length years.
 * Months must be two digits.
 * Unrecognized formats will not be changed.
 *
 * @param date `YYYY-MM`-input
 * @returns `MM/YYYY`-output
 */
export const formatDate = (date: string) =>
  date.replace(/^(\d+).(\d{2})$/, "$2/$1");

/**
 * Formats a date-range based on optional `from` and `tp`-dates as a nice german string.
 *
 * @param from optional start of the range
 * @param to optional end of the range
 * @returns a nicely formatted string of the range (in german)
 */
export const formatDateRange = (
  from: string | undefined,
  to: string | undefined,
): string | undefined => {
  const fromSet = from !== undefined;
  const toSet = to !== undefined;
  if (fromSet && toSet) return `${formatDate(from)} - ${formatDate(to)}`;
  if (!fromSet && toSet) return `bis ${formatDate(to)}`;
  if (fromSet && !toSet)
    return `${new Date(from) <= new Date() ? "seit" : "ab"} ${formatDate(from)}`;
  return undefined;
};

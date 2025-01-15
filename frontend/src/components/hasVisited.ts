/**
 * The key the visited-state is saved in
 */
const VISITED_KEY = "visited";

/**
 * Query whether the user has already visited this site.
 * @returns `true` if they have, `false` otherwise
 */
export const hasVisited = () =>
  window.localStorage.getItem(VISITED_KEY) !== null;

/**
 * Set whether the user has already visited this site.
 * Call this when an action was performed that counts as having visited the site.
 *
 * @param value optional state to set to. Set to `false` to mark the user as not having visited the site.
 */
export const setHasVisited = (value: boolean = true): void =>
  value
    ? window.localStorage.setItem(VISITED_KEY, "true")
    : window.localStorage.removeItem(VISITED_KEY);

/**
 * Converts a mapping returned by the api to a record.
 *
 * @param api_response mapping returned from API
 * @returns a record to index into.
 */
export const toMapping = (
  api_response: { id: number; name: string }[],
): Record<number, string> =>
  Object.fromEntries(api_response.map(({ id, name }) => [id, name]));

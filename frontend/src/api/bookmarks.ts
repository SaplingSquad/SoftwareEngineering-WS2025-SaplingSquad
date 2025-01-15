import type { QRL, Signal } from "@builder.io/qwik";
import { $, useSignal, useTask$ } from "@builder.io/qwik";
import { useAuthHeader } from "~/auth/useauthheader";
import {
  deleteOrganizationBookmark,
  deleteProjectBookmark,
  getOrganizationBookmarks,
  getProjectBookmarks,
  postOrganizationBookmark,
  postProjectBookmark,
} from "./api_methods.gen";

/**
 * Uses the bookmark state of a project.
 *
 * @param id id of the project
 * @param externalSignal An optional external signal to use instead of creating one
 * @returns A signal that contains whether the project is bookmarked. Updates to the signal will be sent to the server.
 */
export const useProjectBookmark = (
  id: number,
  externalSignal?: Signal<boolean | undefined>,
) => {
  return useBookmark(
    id,
    {
      get$: $((headers) =>
        getProjectBookmarks(headers).then((r) =>
          r.status === 200 ? r.body : undefined,
        ),
      ),
      create$: $((headers, id) => postProjectBookmark(headers, { id: id })),
      delete$: $((headers, id) => deleteProjectBookmark(headers, { id: id })),
    },
    externalSignal,
  );
};

/**
 * Uses the bookmark state of an organization.
 *
 * @param id id of the organization
 * @param externalSignal An optional external signal to use instead of creating one
 * @returns A signal that contains whether the organization is bookmarked. Updates to the signal will be sent to the server.
 */
export const useOrganizationBookmark = (
  id: number,
  externalSignal?: Signal<boolean | undefined>,
) => {
  return useBookmark(
    id,
    {
      get$: $((headers) =>
        getOrganizationBookmarks(headers).then((r) =>
          r.status === 200 ? r.body : undefined,
        ),
      ),
      create$: $((headers, id) =>
        postOrganizationBookmark(headers, { id: id }),
      ),
      delete$: $((headers, id) =>
        deleteOrganizationBookmark(headers, { id: id }),
      ),
    },
    externalSignal,
  );
};

/**
 * Uses the bookmark state of something.
 *
 * @param id Id of the entity.
 * @param param1 The functions to get/create/delete a bookmark
 * @param externalSignal An optional external signal to use instead of creating one
 * @returns A signal that contains whether the entity is bookmarked. Updates to the signal will be sent to the server.
 */
export const useBookmark = (
  id: number,
  {
    get$,
    create$,
    delete$,
  }: {
    get$: QRL<
      (authHeaders: Record<string, string>) => PromiseLike<number[] | undefined>
    >;
    create$: QRL<(authHeaders: Record<string, string>, id: number) => unknown>;
    delete$: QRL<(authHeaders: Record<string, string>, id: number) => unknown>;
  },
  externalSignal?: Signal<boolean | undefined>,
) => {
  const authHeaders = useAuthHeader();
  const publicBookmarkedNewSignal = useSignal<boolean>(); // new signal if none provided
  // state as modified by the client
  const publicBookmarked = externalSignal ?? publicBookmarkedNewSignal;
  // state as last set
  const internalBookmarked = useSignal<boolean>();

  // init
  useTask$(async () => {
    if (!authHeaders.value) return;
    const bookmarks = await get$(authHeaders.value);
    if (bookmarks !== undefined) {
      // received some bookmarks
      const isBookmarked = bookmarks.includes(id);
      internalBookmarked.value = isBookmarked;
      publicBookmarked.value = isBookmarked;
    }
  });

  // updates
  useTask$(({ track }) => {
    const isBookmarked = internalBookmarked.value;
    const shouldBeBookmarked = track(publicBookmarked);
    const headers = authHeaders.value;

    if (!headers) return; // not logged in
    if (isBookmarked === shouldBeBookmarked) return; // no change

    if (shouldBeBookmarked) create$(headers, id);
    else delete$(headers, id);

    // update internal state
    internalBookmarked.value = shouldBeBookmarked;
  });

  return publicBookmarked;
};

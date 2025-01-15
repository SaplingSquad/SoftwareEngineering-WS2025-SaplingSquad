import type { QRL } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import {
  HiBookmarkOutline,
  HiBookmarkSlashOutline,
} from "@qwikest/icons/heroicons";

export type BookmarkProps = {
  /**
   * Whether this card is currently bookmarked
   */
  bookmarked: boolean;
  /**
   * Handler to execute when the bookmark-button is clicked
   */
  onSetBookmarked$: QRL<(newValue: boolean) => unknown>;
};

/**
 * Shows a button that allows to bookmark something.
 * Uses the passed state and listener.
 */
export const BookmarkButton = component$(
  ({ bookmarked, onSetBookmarked$ }: BookmarkProps) => (
    <button onClick$={() => onSetBookmarked$(!bookmarked)}>
      {bookmarked ? (
        <HiBookmarkSlashOutline class="h-7 w-7" />
      ) : (
        <HiBookmarkOutline class="h-7 w-7" />
      )}
    </button>
  ),
);

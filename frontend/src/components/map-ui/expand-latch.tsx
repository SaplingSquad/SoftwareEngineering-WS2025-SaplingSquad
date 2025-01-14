import { type Signal, component$ } from "@builder.io/qwik";
import {
  HiChevronDownOutline,
  HiChevronUpOutline,
} from "@qwikest/icons/heroicons";

/**
 * This latch controls whether the list view is collapsed or expanded.
 */
export const ExpandLatch = component$(
  (props: { expandedProperty: Signal<boolean> }) => {
    return (
      <div
        class="btn pointer-events-auto w-32 rounded-t-none border-t-0 bg-base-100"
        onClick$={() =>
          (props.expandedProperty.value = !props.expandedProperty.value)
        }
      >
        {props.expandedProperty.value ? (
          <HiChevronUpOutline class="size-8" />
        ) : (
          <HiChevronDownOutline class="size-8" />
        )}
      </div>
    );
  },
);

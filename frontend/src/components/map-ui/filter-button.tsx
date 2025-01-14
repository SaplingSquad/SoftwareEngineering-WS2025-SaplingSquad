import { type Signal, component$ } from "@builder.io/qwik";
import { HiFunnelOutline } from "@qwikest/icons/heroicons";

/**
 * A button to open the filter pane, which also displays whether the filter is active.
 */
export const FilterButton = component$(
  (props: {
    filterActive: Signal<boolean>;
    filterWindowActive: Signal<boolean>;
  }) => {
    return (
      <button
        class="btn btn-circle btn-ghost"
        onClick$={() =>
          (props.filterWindowActive.value = !props.filterWindowActive.value)
        }
      >
        <div class="relative">
          <HiFunnelOutline
            class={[
              "size-8",
              props.filterWindowActive.value ? "fill-secondary" : "",
            ]}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="3"
            class={[
              "absolute left-0 top-0 size-8 stroke-error",
              props.filterActive.value ? "invisible" : "",
            ]}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5,2 L19,19"
            />
          </svg>
        </div>
      </button>
    );
  },
);

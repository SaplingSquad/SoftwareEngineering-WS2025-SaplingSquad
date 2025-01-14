import { type Signal, Slot, component$ } from "@builder.io/qwik";

/**
 * Each tab can either be styled as a tab or as a button, depending on whether the list view is collapsed or not.
 */
export const Tab = component$(
  (props: { useBtnStyle: boolean; selection: Signal<number>; idx: number }) => {
    return (
      <label
        class={[
          "grow cursor-pointer justify-items-center",
          props.useBtnStyle ? "btn join-item" : "w-full",
          props.useBtnStyle && props.selection.value === props.idx
            ? "btn-primary"
            : "",
        ]}
      >
        <input
          type="radio"
          name="scope"
          role="tab"
          class="hidden"
          onClick$={() => (props.selection.value = props.idx)}
          checked
        />
        <div
          class={
            props.selection.value === props.idx
              ? props.useBtnStyle
                ? "stroke-primary-content"
                : "stroke-primary"
              : "stroke-[black]"
          }
        >
          <Slot />
        </div>
        <div
          class={[
            "mt-2 w-full border",
            props.useBtnStyle ? "hidden" : "",
            props.selection.value === props.idx
              ? "border-primary"
              : "border-base-200",
          ]}
        ></div>
      </label>
    );
  },
);

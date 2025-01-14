import { type Signal, component$, useSignal } from "@builder.io/qwik";
import {
  HiMagnifyingGlassOutline,
  HiXMarkOutline,
} from "@qwikest/icons/heroicons";

/**
 * The search helps in finding specific projects and organizations.
 */
export const Search = component$(
  (props: { listExpanded: Signal<boolean>; searchText: Signal<string> }) => {
    const searchInputRef = useSignal<HTMLInputElement>();
    const searchActive = useSignal<boolean>(false);

    return (
      <>
        <div class="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Suche nach Projekten, ..."
            class="rounded-full border border-primary py-2 pl-4 pr-10 outline-secondary"
            onKeyDown$={(event, elem) => {
              const searchText = elem.value.trim();
              if (searchText && event.key === "Enter") {
                elem.blur();
                props.listExpanded.value = true;
                props.searchText.value = searchText;
              }
            }}
            onFocusIn$={() => (searchActive.value = true)}
            onFocusOut$={(_, elem) =>
              (searchActive.value = !!elem.value.trim())
            }
          />
          <button
            class={[
              "absolute right-3 top-2",
              searchActive.value ? "" : "invisible",
            ]}
            onClick$={() => {
              searchInputRef.value!.value = "";
              searchActive.value = false;
              props.searchText.value = "";
            }}
          >
            <HiXMarkOutline class="size-7 hover:stroke-error" />
          </button>
        </div>
        <button
          class="btn btn-circle btn-ghost"
          onClick$={() => {
            const searchText = searchInputRef.value?.value.trim();
            if (searchText) {
              props.listExpanded.value = true;
              props.searchText.value = searchText;
            } else {
              searchInputRef.value?.focus();
            }
          }}
        >
          <HiMagnifyingGlassOutline class="size-6" />
        </button>
      </>
    );
  },
);

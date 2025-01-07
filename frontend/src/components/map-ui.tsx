import { type Signal, component$, Slot, useSignal } from "@builder.io/qwik";
import {
  HiBookmarkOutline,
  HiChevronDownOutline,
  HiChevronUpOutline,
  HiClockOutline,
  HiFunnelOutline,
  HiMagnifyingGlassOutline,
  HiMapOutline,
  HiXMarkOutline,
} from "@qwikest/icons/heroicons";
import SproutIcon from "~/../public/Sprout_icon.png?jsx";
import { defaultFilterSettings, Filter } from "./filter";

// prettier-ignore
const projects = [
  { isFavourite: false, title: "Lorem ipsum dolor sit amet" },
  { isFavourite: true, title: "consetetur sadipscing elitr" },
  { isFavourite: false, title: "sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat" },
  { isFavourite: false, title: "sed diam voluptua" },
  { isFavourite: true, title: "At vero eos et accusam et justo duo dolores et ea rebum" },
  { isFavourite: false, title: "Stet clita kasd gubergren" },
  { isFavourite: false, title: "no sea takimata sanctus est Lorem ipsum dolor sit amet" },
  { isFavourite: false, title: "Lorem ipsum dolor sit amet" },
  { isFavourite: false, title: "consetetur sadipscing elitr" },
  { isFavourite: false, title: "sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat" },
  { isFavourite: false, title: "sed diam voluptua" },
  { isFavourite: false, title: "At vero eos et accusam et justo duo dolores et ea rebum" },
  { isFavourite: false, title: "Stet clita kasd gubergren" },
  { isFavourite: false, title: "no sea takimata sanctus est Lorem ipsum dolor sit amet" },
];

export const MapMenu = component$(() => {
  const searchActive = useSignal<boolean>(false);
  const listActive = useSignal<boolean>(false);
  const searchInputRef = useSignal<HTMLInputElement>();
  const selection = useSignal<number>(0);
  const filterActive = useSignal<boolean>(false);
  const listCollapsed = useSignal<boolean>(true);

  return (
    <>
      <div class="pointer-events-none fixed left-0 top-0 flex max-h-screen space-x-2 p-4">
        <div class="flex flex-col items-center">
          <div class="flex h-[95%] max-h-max max-w-min flex-col overflow-hidden rounded-box bg-base-200">
            <div class="navbar pointer-events-auto w-max space-x-2 bg-base-100">
              <div class="navbar-start">
                <a href="/" class="btn btn-ghost flex items-center text-2xl">
                  <SproutIcon class="h-6 w-6" />
                  Sprout
                </a>
              </div>
              <div class="navbar-end space-x-1">
                <div class="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Suche nach Projekten, ..."
                    class="rounded-full border border-primary py-2 pl-4 pr-10 outline-secondary"
                    onKeyDown$={(event, elem) => {
                      if (event.key == "Enter") {
                        listActive.value = true;
                        elem.blur();
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
                      listActive.value = false;
                    }}
                  >
                    <HiXMarkOutline class="size-7 hover:stroke-error" />
                  </button>
                </div>
                <button
                  class="btn btn-circle btn-ghost"
                  onClick$={() => {
                    if (searchInputRef.value?.value.trim()) {
                      listActive.value = true;
                    } else {
                      searchInputRef.value?.focus();
                    }
                  }}
                >
                  <HiMagnifyingGlassOutline class="size-6" />
                </button>
                <button
                  class="btn btn-circle btn-ghost"
                  onClick$={() => (filterActive.value = !filterActive.value)}
                >
                  <HiFunnelOutline
                    class={[
                      "size-8",
                      filterActive.value ? "fill-secondary" : "",
                    ]}
                  />
                </button>
              </div>
            </div>
            <div
              class={[
                "transition-all",
                listCollapsed.value ? "max-h-0" : "max-h-screen",
              ]}
            >
              <div class="w-full border"></div>
              <div class="pointer-events-auto flex-col space-y-4 overflow-auto bg-base-100 p-4 shadow-2xl">
                <div role="tablist" class="flex">
                  <Tab selection={selection} idx={0}>
                    <HiMapOutline class="size-6 stroke-inherit" />
                  </Tab>
                  <Tab selection={selection} idx={1}>
                    <HiBookmarkOutline class="size-6 stroke-inherit" />
                  </Tab>
                  <Tab selection={selection} idx={2}>
                    <HiClockOutline class="size-6 stroke-inherit" />
                  </Tab>
                </div>
                {projects
                  .filter((proj) =>
                    proj.title.includes(
                      searchInputRef.value === undefined
                        ? ""
                        : searchInputRef.value.value,
                    ),
                  )
                  .map((proj, idx) => (
                    <div key={idx} class="h-32 rounded-box bg-base-200 p-4">
                      {proj.title}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div
            class="btn pointer-events-auto w-32 rounded-t-none border-t-0 bg-base-100"
            onClick$={() => (listCollapsed.value = !listCollapsed.value)}
          >
            {listCollapsed.value ? (
              <HiChevronDownOutline class="size-8" />
            ) : (
              <HiChevronUpOutline class="size-8" />
            )}
          </div>
        </div>
        <div
          class={[
            "pointer-events-auto h-fit w-fit",
            filterActive.value ? "" : "hidden",
          ]}
        >
          <Filter filterSettings={defaultFilterSettings() /* TODO */} />
        </div>
      </div>
    </>
  );
});

const Tab = component$((props: { selection: Signal<number>; idx: number }) => {
  return (
    <label class="w-full cursor-pointer justify-items-center space-y-2">
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
            ? "stroke-primary"
            : "stroke-black"
        }
      >
        <Slot />
      </div>
      <div
        class={[
          "w-full border",
          props.selection.value === props.idx ? "border-primary" : "",
        ]}
      ></div>
    </label>
  );
});

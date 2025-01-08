import {
  type Signal,
  component$,
  Slot,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import {
  HiBookmarkOutline,
  HiChevronDownOutline,
  HiChevronUpOutline,
  HiClockOutline,
  HiFunnelOutline,
  HiMagnifyingGlassOutline,
  HiXMarkOutline,
} from "@qwikest/icons/heroicons";
import SproutIcon from "/src/images/Sprout_icon.png?jsx";
import AllIcon from "/src/images/All_Icon.svg?jsx";
import { type FilterSettings, defaultFilterSettings, Filter } from "./filter";

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
  const filterSettings = useStore(defaultFilterSettings());

  const selection = useSignal<number>(0);
  const filterActive = useSignal<boolean>(false);
  const listCollapsed = useSignal<boolean>(true);

  return (
    <>
      <div class="pointer-events-none fixed left-0 top-0 flex h-screen items-start space-x-2 p-4">
        <div class="flex h-full flex-col items-center">
          <div class="pointer-events-auto flex max-w-min flex-col overflow-hidden rounded-box bg-base-200">
            <Navbar
              filterSettings={filterSettings}
              filterWindowActive={filterActive}
            />
            <div class="w-full border" />
            <div class="flex flex-col overflow-hidden bg-base-100 p-4">
              <Tablist
                selection={selection}
                useBtnStyle={listCollapsed.value}
              />
              <div
                class={[
                  "space-y-2 overflow-y-auto transition-all",
                  listCollapsed.value ? "h-0" : "h-full",
                ]}
              >
                {projects.map((proj, idx) => (
                  <div key={idx} class="h-32 rounded-box bg-base-200 p-4">
                    {proj.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ExpandLatch collapsedProperty={listCollapsed} />
        </div>
        <div
          class={[
            "pointer-events-auto w-full",
            filterActive.value ? "" : "hidden",
          ]}
        >
          <Filter filterSettings={filterSettings} />
        </div>
      </div>
    </>
  );
});

const Navbar = component$(
  (props: {
    filterSettings: FilterSettings;
    filterWindowActive: Signal<boolean>;
  }) => {
    const searchInputRef = useSignal<HTMLInputElement>();
    const searchActive = useSignal<boolean>(false);
    const listActive = useSignal<boolean>(false);

    return (
      <div class="navbar w-max space-x-2 bg-base-100">
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
          <FilterButton
            filterSettings={props.filterSettings}
            filterWindowActive={props.filterWindowActive}
          />
        </div>
      </div>
    );
  },
);

const FilterButton = component$(
  (props: {
    filterSettings: FilterSettings;
    filterWindowActive: Signal<boolean>;
  }) => {
    return (
      <button
        class="btn btn-circle btn-ghost"
        onClick$={() =>
          (props.filterWindowActive.value = !props.filterWindowActive.value)
        }
      >
        <HiFunnelOutline
          class={[
            "size-8",
            props.filterWindowActive.value ? "fill-secondary" : "",
          ]}
        />
      </button>
    );
  },
);

const Tablist = component$(
  (props: { selection: Signal<number>; useBtnStyle: boolean }) => {
    return (
      <div role="tablist" class={["flex", props.useBtnStyle ? "join" : "pb-2"]}>
        <Tab
          useBtnStyle={props.useBtnStyle}
          selection={props.selection}
          idx={0}
        >
          <AllIcon />
        </Tab>
        <Tab
          useBtnStyle={props.useBtnStyle}
          selection={props.selection}
          idx={1}
        >
          <HiBookmarkOutline class="size-6 stroke-inherit" />
        </Tab>
        <Tab
          useBtnStyle={props.useBtnStyle}
          selection={props.selection}
          idx={2}
        >
          <HiClockOutline class="size-6 stroke-inherit" />
        </Tab>
      </div>
    );
  },
);

const Tab = component$(
  (props: { useBtnStyle: boolean; selection: Signal<number>; idx: number }) => {
    return (
      <label
        class={[
          "grow cursor-pointer justify-items-center",
          props.useBtnStyle ? "btn join-item" : "w-full",
          props.useBtnStyle && props.selection.value == props.idx
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
              : "stroke-black"
          }
        >
          <Slot />
        </div>
        <div
          class={[
            "mt-2 w-full border",
            props.useBtnStyle ? "hidden" : "",
            props.selection.value === props.idx ? "border-primary" : "",
          ]}
        ></div>
      </label>
    );
  },
);

const ExpandLatch = component$(
  (props: { collapsedProperty: Signal<boolean> }) => {
    return (
      <div
        class="btn pointer-events-auto w-32 rounded-t-none border-t-0 bg-base-100"
        onClick$={() =>
          (props.collapsedProperty.value = !props.collapsedProperty.value)
        }
      >
        {props.collapsedProperty.value ? (
          <HiChevronDownOutline class="size-8" />
        ) : (
          <HiChevronUpOutline class="size-8" />
        )}
      </div>
    );
  },
);

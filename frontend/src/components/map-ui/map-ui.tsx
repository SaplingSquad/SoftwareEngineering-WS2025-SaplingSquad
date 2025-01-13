import {
  type Signal,
  $,
  component$,
  Slot,
  useOnWindow,
  useSignal,
  useStore,
  useTask$,
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
import SproutIcon from "/src/images/Sprout_icon.svg?jsx";
import AllIcon from "/src/images/All_Icon.svg?jsx";
import { type FilterSettings, Filter } from "../filter";
import { ProjectLargeInfo } from "./project-largeinfo";
import {
  organizationBookmarksMockData,
  projectBookmarksMockData,
  searchOutputMockdata,
} from "./mockdata";
import type { Ranking, SearchInput, SearchOutput } from "./types";
import { getAnswersFromLocalStorage } from "~/utils";
import { OrganizationLargeInfo } from "./organization-largeinfo";
import { ShortInfo } from "./shortinfo";

enum ResultTab {
  ALL,
  BOOKMARKS,
  HISTORY,
}

/**
 * Create an SearchOutput object that does not contain any `rankings`, `organizationLocations` or `projectLocations` but has all properties set to avoid access to undefined.
 * @returns The empty SearchOutput object.
 */
function createEmptySearchOutput(): SearchOutput {
  return {
    rankings: [],
    organizationLocations: {
      type: "FeatureCollection",
      features: [],
    },
    projectLocations: {
      type: "FeatureCollection",
      features: [],
    },
  };
}

/**
 * The UI laid over the map, provides options to control what is shown on the map and displays the results in a list.
 */
export const MapUI = component$(
  (props: {
    organizationLocations: Signal<GeoJSON.GeoJSON>;
    projectLocations: Signal<GeoJSON.GeoJSON>;
  }) => {
    const filterSettings: FilterSettings = useStore({});
    const tabSelection = useSignal<ResultTab>(ResultTab.ALL);
    const filterActive = useSignal<boolean>(true);
    const filterWindowActive = useSignal<boolean>(false);
    const listExpanded = useSignal<boolean>(false);
    const searchText = useSignal<string>("");
    const selectedRanking = useSignal<Ranking | undefined>(undefined);
    const rawResult = useSignal<SearchOutput>(createEmptySearchOutput());
    const history = useStore<SearchOutput>(createEmptySearchOutput());
    const result = useSignal<SearchOutput>({ rankings: [] });

    const update = $((performSearch: boolean) => {
      if (performSearch) {
        const searchInput: SearchInput = {
          answers: getAnswersFromLocalStorage(),
          searchText: searchText.value || undefined,
          ...filterSettings,
        };

        // TODO replace with API call
        searchInput;
        rawResult.value = searchOutputMockdata;
      }

      switch (tabSelection.value) {
        case ResultTab.ALL:
          result.value = rawResult.value;
          break;
        case ResultTab.HISTORY:
          result.value = history;
          break;
        case ResultTab.BOOKMARKS:
          result.value = {
            rankings: rawResult.value.rankings.filter((ranking) =>
              (ranking.type === "Organization"
                ? organizationBookmarksMockData
                : projectBookmarksMockData
              ).includes(ranking.content.id),
            ),
            organizationLocations: {
              type: "FeatureCollection",
              features:
                rawResult.value.organizationLocations?.features.filter(
                  (feature) =>
                    organizationBookmarksMockData.includes(
                      feature.properties.id,
                    ),
                ) || [],
            },
            projectLocations: {
              type: "FeatureCollection",
              features:
                rawResult.value.projectLocations?.features.filter((feature) =>
                  projectBookmarksMockData.includes(feature.properties.id),
                ) || [],
            },
          };
          break;
      }

      props.organizationLocations.value = result.value.organizationLocations!;
      props.projectLocations.value = result.value.projectLocations!;
    });
    useOnWindow(
      "load",
      $(() => update(true)),
    );
    useTask$(({ track }) => {
      track(filterSettings);
      track(searchText);
      update(true);
    });
    useTask$(({ track }) => {
      track(tabSelection);
      update(false);
    });

    useTask$(({ track }) => {
      const selection = track(selectedRanking);
      if (!selection || tabSelection.value === ResultTab.HISTORY) return;

      const idx = history.rankings.findIndex(
        (r) =>
          r.type === selection.type && r.content.id === selection.content.id,
      );

      if (idx === -1) {
        history.rankings.unshift(selection);
        (selection.type === "Organization"
          ? history.organizationLocations
          : history.projectLocations
        )?.features.push(
          (selection.type === "Organization"
            ? result.value.organizationLocations
            : result.value.projectLocations)!.features.find(
            (f) => f.properties.id === selection.content.id,
          )!,
        );
      } else {
        history.rankings.splice(idx, 1);
        history.rankings.unshift(selection);
      }
    });

    return (
      <>
        <div class="pointer-events-none fixed left-0 top-0 flex h-screen items-start space-x-2 p-4">
          <div class="flex h-full flex-col items-center">
            <div class="pointer-events-auto flex max-w-min flex-col overflow-hidden rounded-box bg-base-200">
              <Navbar
                filterActive={filterActive}
                filterWindowActive={filterWindowActive}
                listExpanded={listExpanded}
                searchText={searchText}
              />
              <div class="w-full border border-base-200" />
              <div class="flex flex-col overflow-hidden bg-base-100 p-4">
                <Tablist
                  selection={tabSelection}
                  useBtnStyle={!listExpanded.value}
                />
                <div
                  class={[
                    "space-y-2 overflow-y-auto pr-2 transition-all",
                    listExpanded.value ? "h-full" : "h-0",
                  ]}
                >
                  {result.value.rankings.map((ranking) => (
                    <ShortInfo
                      key={ranking.type + "_" + ranking.content.id}
                      ranking={ranking}
                      onClick={$(() => {
                        selectedRanking.value = ranking;
                      })}
                    />
                  ))}
                </div>
              </div>
            </div>
            <ExpandLatch expandedProperty={listExpanded} />
          </div>
          <div
            class={[
              "pointer-events-auto w-full",
              filterWindowActive.value ? "" : "hidden",
            ]}
          >
            <Filter
              filterSettings={filterSettings}
              filterActive={filterActive}
            />
          </div>
        </div>
        {selectedRanking.value && (
          <div class="fixed right-0 top-0 h-screen p-4">
            {selectedRanking.value.type === "Organization" ? (
              <OrganizationLargeInfo
                org={selectedRanking.value.content}
                onClose={$(() => (selectedRanking.value = undefined))}
              />
            ) : (
              <ProjectLargeInfo
                project={selectedRanking.value.content}
                onClose={$(() => (selectedRanking.value = undefined))}
              />
            )}
          </div>
        )}
      </>
    );
  },
);

/**
 * The navbar shows the project logo and name, contains the search and allows to configure the filter.
 */
const Navbar = component$(
  (props: {
    filterActive: Signal<boolean>;
    filterWindowActive: Signal<boolean>;
    listExpanded: Signal<boolean>;
    searchText: Signal<string>;
  }) => {
    return (
      <div class="navbar w-max space-x-2 bg-base-100">
        <div class="navbar-start">
          <a href="/" class="btn btn-ghost flex items-center text-2xl">
            <SproutIcon class="size-8" />
            Sprout
          </a>
        </div>
        <div class="navbar-end space-x-1">
          <Search
            listExpanded={props.listExpanded}
            searchText={props.searchText}
          />
          <FilterButton
            filterActive={props.filterActive}
            filterWindowActive={props.filterWindowActive}
          />
        </div>
      </div>
    );
  },
);

/**
 * The search helps in finding specific projects and organizations.
 */
const Search = component$(
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

/**
 * A button to open the filter pane, which also displays whether the filter is active.
 */
const FilterButton = component$(
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

/**
 * The tablist allows to switch between showing all results, only the bookmarked results or only the recent results.
 */
const Tablist = component$(
  (props: { selection: Signal<number>; useBtnStyle: boolean }) => {
    return (
      <div role="tablist" class={["flex", props.useBtnStyle ? "join" : "pb-2"]}>
        <Tab
          useBtnStyle={props.useBtnStyle}
          selection={props.selection}
          idx={0}
        >
          <AllIcon class="h-6" />
        </Tab>
        <Tab
          useBtnStyle={props.useBtnStyle}
          selection={props.selection}
          idx={1}
        >
          <HiBookmarkOutline class="stroke-inherit size-6" />
        </Tab>
        <Tab
          useBtnStyle={props.useBtnStyle}
          selection={props.selection}
          idx={2}
        >
          <HiClockOutline class="stroke-inherit size-6" />
        </Tab>
      </div>
    );
  },
);

/**
 * Each tab can either be styled as a tab or as a button, depending on whether the list view is collapsed or not.
 */
const Tab = component$(
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

/**
 * This latch controls whether the list view is collapsed or expanded.
 */
const ExpandLatch = component$(
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

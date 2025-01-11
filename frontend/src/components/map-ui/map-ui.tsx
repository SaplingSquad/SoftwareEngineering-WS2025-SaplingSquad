import { type Signal, $, component$, Slot, useSignal } from "@builder.io/qwik";
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
import { ProjectShortInfo } from "./project-shortinfo";
import { ProjectLargeInfo } from "./project-largeinfo";
import { OrganizationShortInfo } from "./organization-shortinfo";
import { mockdata } from "./mockdata";

enum ResultTab {
  ALL,
  BOOKMARKS,
  HISTORY,
}

/**
 * The UI laid over the map, provides options to control what is shown on the map and displays the results in a list.
 */
export const MapUI = component$(
  (props: {
    filterSettings: FilterSettings;
    organizationLocations: Signal<GeoJSON.GeoJSON>;
    projectLocations: Signal<GeoJSON.GeoJSON>;
  }) => {
    const tabSelection = useSignal<ResultTab>(ResultTab.ALL);
    const filterActive = useSignal<boolean>(false);
    const listExpanded = useSignal<boolean>(false);
    const searchText = useSignal<string>("");
    const selectedProject = useSignal<Project | undefined>(undefined);

    const searchInput: SearchInput = {
      answers: undefined,
      maxMembers:
        props.filterSettings.filterActive && props.filterSettings.limitOrgSize
          ? props.filterSettings.maxOrgSize // TODO remove limitOrgSize, use maxOrgSize instead
          : undefined,
      searchText: searchText.value,
      continent: props.filterSettings.filterActive
        ? props.filterSettings.selectedContinent.toString() // TODO is not a string
        : undefined,
      regionId: props.filterSettings.filterActive
        ? props.filterSettings.selectedContinent.toString() // TODO is not a string
        : undefined,
      type: props.filterSettings.filterActive
        ? undefined // TODO wait for modified ui that directly controls this property
        : undefined,
    };
    const searchResult = search(searchInput);
    props.organizationLocations.value = searchResult.organizationLocations;
    props.projectLocations.value = searchResult.projectLocations;

    return (
      <>
        <div class="pointer-events-none fixed left-0 top-0 flex h-screen items-start space-x-2 p-4">
          <div class="flex h-full flex-col items-center">
            <div class="pointer-events-auto flex max-w-min flex-col overflow-hidden rounded-box bg-base-200">
              <Navbar
                filterSettings={props.filterSettings}
                filterWindowActive={filterActive}
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
                  {searchResult.rankings.map(({ type, content }, idx) =>
                    type == "Project" ? (
                      <ProjectShortInfo
                        key={idx}
                        project={content as Project}
                        onClick={$(() => {
                          selectedProject.value = content as Project;
                        })}
                      />
                    ) : (
                      <OrganizationShortInfo
                        key={idx}
                        org={content as Organization}
                        onClick={$(() => {
                          console.log(content);
                        })}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
            <ExpandLatch expandedProperty={listExpanded} />
          </div>
          <div
            class={[
              "pointer-events-auto w-full",
              filterActive.value ? "" : "hidden",
            ]}
          >
            <Filter filterSettings={props.filterSettings} />
          </div>
        </div>
        {selectedProject.value && (
          <div class="fixed right-0 top-0 h-screen p-4">
            <ProjectLargeInfo
              project={selectedProject.value}
              onClose={$(() => (selectedProject.value = undefined))}
            />
          </div>
        )}
      </>
    );
  },
);

type SearchInput = {
  answers?: number[];
  maxMembers?: number;
  searchText?: string;
  continent?: string;
  regionId?: string;
  type?: "Project" | "Orga";
};

export type Organization = {
  id: number;
  name: string;
  description: string;
  foundingYear: number;
  memberCount: number;
  iconUrl: string;
  imageUrls: string[];
  webPageUrl: string;
  donatePageUrl: string;
  coordinates: [number, number];
  tags: number[];
  regionName: string;
  numProjects: number; // TODO not actually present
};

export type Project = {
  id: number;
  orgaId: number;
  name: string;
  description: string;
  dateFrom: string;
  dateTo: string;
  iconUrl: string;
  imageUrls: string[];
  webPageUrl: string;
  donatePageUrl: string;
  coordinates: [number, number];
  tags: number[];
  regionName: string;
  orgaName: string; // TODO not actually present
};

export type SearchOutput = {
  rankings: {
    type: "Organization" | "Project";
    content: Organization | Project;
    percentageMatch: number;
  }[];
  organizationLocations: {
    type: "FeatureCollection";
    features: {
      type: "Feature";
      properties: {
        id: number;
      };
      geometry: {
        type: "Point";
        coordinates: [number, number];
      };
    }[];
  };
  projectLocations: {
    type: "FeatureCollection";
    features: {
      type: "Feature";
      properties: {
        projectId: number;
      };
      geometry: {
        type: "Point";
        coordinates: [number, number];
      };
    }[];
  };
};

function search(searchInput: SearchInput) {
  console.log(searchInput);
  // TODO replace with API call
  return mockdata;
}

/**
 * The navbar shows the project logo and name, contains the search and allows to configure the filter.
 */
const Navbar = component$(
  (props: {
    filterSettings: FilterSettings;
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
            filterSettings={props.filterSettings}
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
              if (searchText && event.key == "Enter") {
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
 * A button to open the filter pane, which also communicates whether the filter is active.
 */
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
              props.filterSettings.filterActive ? "invisible" : "",
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

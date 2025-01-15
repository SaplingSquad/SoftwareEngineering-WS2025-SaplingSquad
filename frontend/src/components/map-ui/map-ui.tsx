import {
  type Signal,
  $,
  component$,
  useOnWindow,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { type FilterSettings, Filter } from "../filter";
import { ProjectLargeInfo } from "./project-largeinfo";
import {
  organizationBookmarksMockData,
  projectBookmarksMockData,
} from "./mockdata";
import {
  createEmptyFeatureCollection,
  createEmptySearchOutput,
  type Ranking,
  type SearchInput,
  type SearchOutput,
} from "./types";
import { getAnswersFromLocalStorage } from "~/utils";
import { OrganizationLargeInfo } from "./organization-largeinfo";
import { ShortInfo } from "./shortinfo";
import { Navbar } from "./navbar";
import { Tablist } from "./tablist";
import { ExpandLatch } from "./expand-latch";
import { getMatches } from "~/api/api_methods.gen";
import { HiExclamationCircleOutline } from "@qwikest/icons/heroicons";

enum ResultTab {
  ALL,
  BOOKMARKS,
  HISTORY,
}

enum State {
  LOADING,
  ERROR,
  SUCCESS,
}

function renderState(
  state: State,
  result: SearchOutput,
  selectedRanking: Signal<Ranking | undefined>,
) {
  switch (state) {
    case State.ERROR:
      return (
        <div role="alert" class="alert alert-error">
          <HiExclamationCircleOutline class="h-10 w-10" />
          <span class="max-h-full min-h-min min-w-min max-w-full overflow-y-auto ">
            <h5 class="text-lg font-semibold">
              Daten konnten nicht geladen werden.
            </h5>
            <p class="mb-2">
              Bitte stelle sicher, dass du mit dem Internet verbunden bist.
            </p>
          </span>
        </div>
      );
    case State.LOADING:
      return (
        <div class="flex w-full justify-center p-4">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      );
    case State.SUCCESS:
      return result.rankings.map((ranking, idx) => (
        <ShortInfo
          key={ranking.entry.type + "_" + ranking.entry.content.id}
          entry={ranking.entry}
          layoutDelay={idx * 1000}
          onClick={$(() => {
            selectedRanking.value = ranking;
          })}
        />
      ));
  }
}

/**
 * The UI laid over the map, provides options to control what is shown on the map and displays the results in a list.
 */
export const MapUI = component$(
  (props: {
    organizationLocations: Signal<GeoJSON.GeoJSON>;
    projectLocations: Signal<GeoJSON.GeoJSON>;
  }) => {
    const filterSettings: FilterSettings = useStore({
      type: undefined,
      maxMembers: undefined,
      continentId: undefined,
      regionId: undefined,
    });
    const tabSelection = useSignal<ResultTab>(ResultTab.ALL);
    const filterActive = useSignal<boolean>(true);
    const filterWindowActive = useSignal<boolean>(false);
    const listExpanded = useSignal<boolean>(false);
    const searchText = useSignal<string>("");
    const selectedRanking = useSignal<Ranking | undefined>(undefined);
    const rawResult = useSignal<SearchOutput>(createEmptySearchOutput());
    const history = useStore<SearchOutput>(createEmptySearchOutput());
    const result = useSignal<SearchOutput>({ rankings: [] });
    const state = useSignal<State>(State.LOADING);

    useTask$(({ track }) => {
      if (track(state) === State.ERROR) {
        listExpanded.value = true;
      }
    });

    const update = $(async (performSearch: boolean) => {
      state.value = State.LOADING;

      if (performSearch) {
        const searchInput: SearchInput = {
          answers: getAnswersFromLocalStorage(),
          searchText: searchText.value || undefined,
          ...filterSettings,
        };

        await getMatches(searchInput).then(
          (p) => {
            if (p.status === 200) {
              rawResult.value = p.body;
            } else {
              state.value = State.ERROR;
            }
          },
          () => (state.value = State.ERROR),
        );
      }

      if (state.value !== State.LOADING) {
        props.organizationLocations.value = createEmptyFeatureCollection();
        props.projectLocations.value = createEmptyFeatureCollection();
        return;
      }

      switch (tabSelection.value) {
        case ResultTab.ALL:
          result.value = {
            rankings: rawResult.value.rankings.slice(0, 1000),
            organizationLocations: {
              type: "FeatureCollection",
              features: rawResult.value.organizationLocations!.features.slice(
                0,
                1000,
              ),
            },
            projectLocations: {
              type: "FeatureCollection",
              features: rawResult.value.projectLocations!.features.slice(
                0,
                1000,
              ),
            },
          };
          break;
        case ResultTab.HISTORY:
          result.value = history;
          break;
        case ResultTab.BOOKMARKS:
          result.value = {
            rankings: rawResult.value.rankings.filter((ranking) =>
              (ranking.entry.type === "Organization"
                ? organizationBookmarksMockData
                : projectBookmarksMockData
              ).includes(ranking.entry.content.id),
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

      state.value = State.SUCCESS;

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
          r.entry.type === selection.entry.type &&
          r.entry.content.id === selection.entry.content.id,
      );

      if (idx === -1) {
        history.rankings.unshift(selection);
        (selection.entry.type === "Organization"
          ? history.organizationLocations
          : history.projectLocations
        )?.features.push(
          (selection.entry.type === "Organization"
            ? result.value.organizationLocations
            : result.value.projectLocations)!.features.find(
            (f) => f.properties.id === selection.entry.content.id,
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
                  {renderState(state.value, result.value, selectedRanking)}
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
            {selectedRanking.value.entry.type === "Organization" ? (
              <OrganizationLargeInfo
                org={selectedRanking.value.entry.content}
                onClose={$(() => (selectedRanking.value = undefined))}
              />
            ) : (
              <ProjectLargeInfo
                project={selectedRanking.value.entry.content}
                onClose={$(() => (selectedRanking.value = undefined))}
              />
            )}
          </div>
        )}
      </>
    );
  },
);

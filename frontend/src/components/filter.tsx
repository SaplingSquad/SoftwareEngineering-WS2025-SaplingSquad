import { type Signal, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { HiInformationCircleOutline } from "@qwikest/icons/heroicons";
import { getRegions } from "~/api/api_methods.gen";

type Region = {
  id: string;
  name: string;
};

type Continent = {
  id: string;
  name: string;
  regions: Region[];
};

const orgSizes = [20, 100, 500, 1000];

type ShowOnly = "Organization" | "Project" | undefined;

export type FilterSettings = {
  type: "Organization" | "Project" | undefined;
  maxMembers: number | undefined;
  continentId: string | undefined;
  regionId: string | undefined;
};

/**
 * Get all map continents and the respective regions.
 * @returns The continents and regions.
 */
const getContinents = async (): Promise<Continent[]> => {
  return (
    (await getRegions().then((r) => {
      if (r.status === 200) {
        return r.body;
      }
    })) || []
  );
};

/**
 * A filter component styled like a card which can be used to return to the questions page and allows to configure various filters.
 */
export const Filter = component$(
  (props: {
    filterSettings: FilterSettings;
    filterActive: Signal<boolean>;
  }) => {
    const limitOrgSize = useSignal<boolean>(false);
    const maxOrgSizeIdx = useSignal<string>("1");
    const selectedContinent = useSignal<string>("-1");
    const selectedRegion = useSignal<string>("-1");
    const showOnly = useSignal<ShowOnly>(undefined);
    const continents = useSignal<Continent[]>([]);

    useTask$(async () => {
      await getContinents().then((c) => {
        continents.value = c;
      });
    });

    useTask$(({ track }) => {
      props.filterSettings.type = track(props.filterActive)
        ? track(showOnly)
        : undefined;
      props.filterSettings.maxMembers =
        track(props.filterActive) && track(limitOrgSize)
          ? orgSizes[parseInt(track(maxOrgSizeIdx))]
          : undefined;
      props.filterSettings.continentId = track(props.filterActive)
        ? continents.value[parseInt(track(selectedContinent))]?.id
        : undefined;
      props.filterSettings.regionId = track(props.filterActive)
        ? continents.value[parseInt(track(selectedContinent))]?.regions[
            parseInt(track(selectedRegion))
          ]?.id
        : undefined;
    });

    return (
      <div class="w-104 inline-block space-y-2 rounded-xl bg-base-100 p-4 shadow-2xl">
        <label class="label cursor-pointer justify-start space-x-4">
          <input
            type="checkbox"
            class="toggle toggle-primary"
            bind:checked={props.filterActive}
            checked={props.filterActive.value}
          />
          <span class="label-text">Ergebnisse filtern</span>
        </label>
        <div class={props.filterActive.value ? "" : "cursor-not-allowed"}>
          <div
            class={[
              "space-y-4",
              props.filterActive.value
                ? ""
                : "bg-gray pointer-events-none opacity-60",
            ]}
          >
            <div class="w-full border border-base-200" />
            <a href="/questions" class="btn btn-primary w-full">
              Schwerpunkte bearbeiten
            </a>
            <TypeSelection showOnly={showOnly} />
            <SizeFilter
              limitOrgSize={limitOrgSize}
              maxOrgSizeIdx={maxOrgSizeIdx}
            />
            <GeographicFilter
              continents={continents}
              selectedContinent={selectedContinent}
              selectedRegion={selectedRegion}
            />
          </div>
        </div>
      </div>
    );
  },
);

/**
 * Synchronized toggles that allow to filter out organizations or projects, but not both.
 */
const TypeSelection = component$((props: { showOnly: Signal<ShowOnly> }) => {
  return (
    <div>
      <label class="label cursor-pointer justify-start space-x-4">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          checked={props.showOnly.value != "Project"}
          onClick$={(_, currentTarget) =>
            (props.showOnly.value =
              currentTarget.checked || props.showOnly.value === "Project"
                ? undefined
                : "Project")
          }
        />
        <span class="label-text">Vereine anzeigen</span>
      </label>
      <label class="label cursor-pointer justify-start space-x-4">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          checked={props.showOnly.value != "Organization"}
          onClick$={(_, currentTarget) =>
            (props.showOnly.value =
              currentTarget.checked || props.showOnly.value === "Organization"
                ? undefined
                : "Organization")
          }
        />
        <span class="label-text">Projekte anzeigen</span>
      </label>
    </div>
  );
});

/**
 * A slider that can be enabled or disabled and allows to choose between different size limits for organizations.
 */
const SizeFilter = component$(
  (props: { limitOrgSize: Signal<boolean>; maxOrgSizeIdx: Signal<string> }) => {
    return (
      <div class="space-y-0">
        <label class="label cursor-pointer space-x-4 pt-0">
          <span class="label-text">
            Nur Vereine (und deren Projekte) bestimmter Größe anzeigen?
          </span>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            bind:checked={props.limitOrgSize}
          />
        </label>
        <input
          type="range"
          min="0"
          max={orgSizes.length - 1}
          bind:value={props.maxOrgSizeIdx}
          class={[
            "range",
            props.limitOrgSize.value
              ? "range-primary"
              : "[--range-shdw:#e8e8e8]",
          ]}
          step="1"
          disabled={!props.limitOrgSize.value}
        />
        <div
          class={[
            "flex w-full justify-between px-2 text-xs",
            props.limitOrgSize.value ? "" : "text-[#8a8a8a]",
          ]}
        >
          {orgSizes.map((size: number) => {
            return <span key={size}>&lt;{size} Mitglieder</span>;
          })}
        </div>
      </div>
    );
  },
);

/**
 * Displays two dropdowns that allow to filter for specific continents/regions.
 * Region selection becomes available after selecting a continent.
 */
const GeographicFilter = component$(
  (props: {
    continents: Signal<Continent[]>;
    selectedContinent: Signal<string>;
    selectedRegion: Signal<string>;
  }) => {
    return (
      <div class="space-y-2">
        <div class="form-control space-y-1">
          <div class="label-text">
            Ergebnisse auf einen Kontinent beschränken?
          </div>
          <select
            class="select select-primary"
            bind:value={props.selectedContinent}
            onChange$={() => (props.selectedRegion.value = "-1")}
          >
            <option value="-1">Keine Beschränkung</option>
            {props.continents.value.map(
              (continent: { id: string; name: string }, idx: number) => (
                <option
                  key={idx}
                  value={idx}
                  selected={parseInt(props.selectedContinent.value) === idx}
                >
                  {continent.name}
                </option>
              ),
            )}
          </select>
        </div>
        <div class="form-control space-y-1">
          <div class="label-text">Ergebnisse auf eine Region beschränken?</div>
          <select
            class="select select-primary"
            bind:value={props.selectedRegion}
            disabled={props.selectedContinent.value === "-1"}
          >
            <option value="-1">Keine Beschränkung</option>
            {props.selectedContinent.value != "-1" &&
              props.continents.value[
                parseInt(props.selectedContinent.value)
              ].regions.map(
                (region: { id: string; name: string }, idx: number) => (
                  <option
                    key={idx}
                    value={idx}
                    selected={parseInt(props.selectedRegion.value) === idx}
                  >
                    {region.name}
                  </option>
                ),
              )}
          </select>
          <div
            class={[
              "flex flex-row items-center space-x-2",
              props.selectedContinent.value === "-1" ? "" : "invisible",
            ]}
          >
            <HiInformationCircleOutline />
            <div class="label-text">
              Zuerst muss ein Kontinent ausgewählt werden
            </div>
          </div>
        </div>
      </div>
    );
  },
);

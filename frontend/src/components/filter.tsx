import { type Signal, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { HiInformationCircleOutline } from "@qwikest/icons/heroicons";

const continents: {
  id: number;
  name: string;
}[] = [
  { id: 0, name: "Afrika" },
  { id: 1, name: "Antarktis" },
  { id: 2, name: "Asien" },
  { id: 3, name: "Australien" },
  { id: 4, name: "Europa" },
  { id: 5, name: "Nordamerika" },
  { id: 6, name: "Südamerika" },
];

// prettier-ignore
const regions: {
  id: number;
  name: string;
}[][] = [
  [ /* Afrika */ { id: 1, name: "Südafrika" }, { id: 2, name: "Mosambik" }, { id: 3, name: "Elfenbeinküste" } ],
  [ /* Antarktis */ { id: 4, name: "Region 1" }, { id: 5, name: "Region 2" }, { id: 6, name: "Region 3" } ],
  [ /* Asien */ { id: 7, name: "China" }, { id: 8, name: "Nepal" }, { id: 9, name: "Japan" } ],
  [ /* Australien */ { id: 7, name: "Western Australia" }, { id: 8, name: "Southern Australia" }, { id: 9, name: "Northern Territory" } ],
  [ /* Europa */ { id: 10, name: "Italien" }, { id: 11, name: "Deutschland" }, { id: 12, name: "Österreich" } ],
  [ /* Nordamerika */ { id: 13, name: "USA" }, { id: 14, name: "Kanada" }, { id: 15, name: "Mexiko" } ],
  [ /* Südamerika */ { id: 16, name: "Chile" }, { id: 17, name: "Venezuela" }, { id: 18, name: "Argentinien" } ],
];

const orgSizes = [20, 100, 500, 1000];

export type FilterSettings = {
  orgPins: boolean;
  projectPins: boolean;
  regionPins: boolean;
  limitOrgSize: boolean;
  maxOrgSize: number;
  selectedContinent: number;
  selectedRegion: number;
};

export function defaultFilterSettings(): FilterSettings {
  return {
    orgPins: true,
    projectPins: true,
    regionPins: true,
    limitOrgSize: false,
    maxOrgSize: 100,
    selectedContinent: -1,
    selectedRegion: -1,
  };
}

/**
 * A filter component styled like a card which can be used to return to the questions page and allows to configure various filters.
 */
// Getters & Setters or nested object and attribute name strings
export const Filter = component$(
  (props: { filterSettings: FilterSettings }) => {
    const orgPins = useSignal<boolean>(props.filterSettings.orgPins);
    const projectPins = useSignal<boolean>(props.filterSettings.projectPins);
    const regionPins = useSignal<boolean>(props.filterSettings.regionPins);
    const limitOrgSize = useSignal<boolean>(props.filterSettings.limitOrgSize);
    const maxOrgSizeIdx = orgSizes.indexOf(props.filterSettings.maxOrgSize);
    const maxOrgSize = useSignal<string>(
      (maxOrgSizeIdx == -1 ? 1 : maxOrgSizeIdx).toString(),
    );
    const selectedContinent = useSignal<string>(
      props.filterSettings.selectedContinent.toString(),
    );
    const selectedRegion = useSignal<string>(
      props.filterSettings.selectedRegion.toString(),
    );

    // prettier-ignore
    useTask$(({ track }) => {
      props.filterSettings.orgPins = track(() => orgPins.value);
      props.filterSettings.projectPins = track(() => projectPins.value);
      props.filterSettings.regionPins = track(() => regionPins.value);
      props.filterSettings.limitOrgSize = track(() => limitOrgSize.value);
      props.filterSettings.maxOrgSize = orgSizes[parseInt((track(() => maxOrgSize.value)))];
      props.filterSettings.selectedContinent = parseInt(track(() => selectedContinent.value));
      props.filterSettings.selectedRegion = parseInt(track(() => selectedRegion.value));
    });

    return (
      <div class="w-104 inline-block space-y-4 rounded-xl bg-base-100 p-4">
        <a href="/questions" class="btn btn-primary w-full">
          Gewählte Schwerpunkte bearbeiten
        </a>
        <div>
          <PinToggle labelText="Verein-Pins anzeigen" property={orgPins} />
          <PinToggle labelText="Projekt-Pins anzeigen" property={projectPins} />
          <PinToggle labelText="Regionen-Pins anzeigen" property={regionPins} />
        </div>
        <SizeFilter limitOrgSize={limitOrgSize} maxOrgSize={maxOrgSize} />
        <GeographicFilter
          selectedContinent={selectedContinent}
          selectedRegion={selectedRegion}
        />
      </div>
    );
  },
);

/**
 * A simple toggle that controls whether pins of a certain type are shown.
 */
const PinToggle = component$(
  (props: { labelText: string; property: Signal<boolean> }) => {
    return (
      <label class="label cursor-pointer justify-start space-x-4">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          checked={props.property.value}
          onClick$={(_, currentTarget) =>
            (props.property.value = currentTarget.checked)
          }
        />
        <span class="label-text">{props.labelText}</span>
      </label>
    );
  },
);

/**
 * A slider that can be enabled or disabled and allows to choose between different size limits for organizations.
 */
const SizeFilter = component$(
  (props: { limitOrgSize: Signal<boolean>; maxOrgSize: Signal<string> }) => {
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
          bind:value={props.maxOrgSize}
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
    selectedContinent: Signal<string>;
    selectedRegion: Signal<string>;
  }) => {
    return (
      <div class="space-y-2">
        <div class="form-control space-y-1">
          <div class="label-text">Pins auf einen Kontinent beschränken?</div>
          <select
            class="select select-primary"
            bind:value={props.selectedContinent}
          >
            <option value="-1">Keine Beschränkung</option>
            {continents.map((continent: { id: number; name: string }) => (
              <option
                key={continent.id}
                value={continent.id}
                selected={
                  parseInt(props.selectedContinent.value) === continent.id
                }
              >
                {continent.name}
              </option>
            ))}
          </select>
        </div>
        <div class="form-control space-y-1">
          <div class="label-text">Pins auf eine Region beschränken?</div>
          <select
            class="select select-primary"
            bind:value={props.selectedRegion}
            disabled={props.selectedContinent.value === "-1"}
          >
            <option value="-1">Keine Beschränkung</option>
            {props.selectedContinent.value != "-1" &&
              regions[parseInt(props.selectedContinent.value)].map(
                (region: { id: number; name: string }) => (
                  <option
                    key={region.id}
                    value={region.id}
                    selected={
                      parseInt(props.selectedRegion.value) === region.id
                    }
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

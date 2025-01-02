import { $, component$, useSignal } from "@builder.io/qwik";
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

/**
 * A filter component styled like a card which can be used to return to the questions page and allows to configure various filters.
 */
export const Filter = component$(() => {
  return (
    <div class="w-104 inline-block space-y-4 rounded-xl bg-base-100 p-4">
      <a href="/questions" class="btn btn-primary w-full">
        Gewählte Schwerpunkte bearbeiten
      </a>
      <div>
        <PinToggle labelText="Verein-Pins anzeigen" />
        <PinToggle labelText="Projekt-Pins anzeigen" />
        <PinToggle labelText="Regionen-Pins anzeigen" />
      </div>
      <SizeFilter />
      <GeographicFilter />
    </div>
  );
});

/**
 * A simple toggle that controls whether pins of a certain type are shown.
 */
const PinToggle = component$((props: { labelText: string }) => {
  return (
    <label class="label cursor-pointer justify-start space-x-4">
      <input
        type="checkbox"
        class="toggle toggle-primary"
        checked
        onClick$={(_, currentTarget) => console.log(currentTarget.checked)}
      />
      <span class="label-text">{props.labelText}</span>
    </label>
  );
});

const SizeFilter = component$(() => {
  const limitSize = useSignal<boolean>(false);

  return (
    <div class="space-y-0">
      <label class="label cursor-pointer space-x-4 pt-0">
        <span class="label-text">
          Nur Vereine (und deren Projekte) bestimmter Größe anzeigen?
        </span>
        <input
          type="checkbox"
          class="toggle toggle-primary"
          onClick$={(_, currentTarget) =>
            (limitSize.value = currentTarget.checked)
          }
        />
      </label>
      <input
        type="range"
        min="0"
        max="3"
        value="1"
        class={[
          "range",
          limitSize.value ? "range-primary" : "[--range-shdw:#e8e8e8]",
        ]}
        step="1"
        disabled={!limitSize.value}
      />
      <div
        class={[
          "flex w-full justify-between px-2 text-xs",
          limitSize.value ? "" : "text-[#8a8a8a]",
        ]}
      >
        <span>&lt;20 Mitglieder</span>
        <span>&lt;100 Mitglieder</span>
        <span>&lt;500 Mitglieder</span>
        <span>&lt;1000 Mitglieder</span>
      </div>
    </div>
  );
});

/**
 * Displays two dropdowns that allow to filter for specific continents/regions.
 * Region selection becomes available after selecting a continent.
 */
const GeographicFilter = component$(() => {
  const regionSelect = useSignal<HTMLSelectElement>();
  const selectedContinent = useSignal<number>(0);
  const regionNotSelectableInfo = useSignal<HTMLElement>();

  const onContinentChange = $((currentTarget: HTMLSelectElement) => {
    if (currentTarget.value === "-1") {
      regionSelect.value!.disabled = true;
      regionSelect.value!.value = "-1";
      regionNotSelectableInfo.value!.classList.remove("invisible");
    } else {
      regionSelect.value!.disabled = false;
      selectedContinent.value! = parseInt(currentTarget.value);
      regionNotSelectableInfo.value!.classList.add("invisible");
    }
  });

  return (
    <div class="space-y-2">
      <div class="form-control space-y-1">
        <div class="label-text">Pins auf einen Kontinent beschränken?</div>
        <select
          class="select select-primary"
          onChange$={(_, currentTarget) => onContinentChange(currentTarget)}
        >
          <option value="-1" selected>
            Keine Beschränkung
          </option>
          {continents.map((continent: { id: number; name: string }) => (
            <option key={continent.id} value={continent.id}>
              {continent.name}
            </option>
          ))}
        </select>
      </div>
      <div class="form-control space-y-1">
        <div class="label-text">Pins auf eine Region beschränken?</div>
        <select ref={regionSelect} class="select select-primary" disabled>
          <option value="-1" selected>
            Keine Beschränkung
          </option>
          {regions[selectedContinent.value].map(
            (region: { id: number; name: string }) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ),
          )}
        </select>
        <div
          ref={regionNotSelectableInfo}
          class="flex flex-row items-center space-x-2"
        >
          <HiInformationCircleOutline />
          <div class="label-text">
            Zuerst muss ein Kontinent ausgewählt werden
          </div>
        </div>
      </div>
    </div>
  );
});

import { $, ClassList, component$, noSerialize, NoSerialize, QRL, useOn, useSignal } from "@builder.io/qwik";
import { HiUserCircleOutline, HiPlusCircleSolid, HiCog6ToothOutline, HiTrashOutline } from "@qwikest/icons/heroicons";
import maplibregl from "maplibre-gl";
import { ClickHandlers, Images, Layers, Sources } from "./map";
/*import { Map } from "~/views/map";*/
/*import { Map } from "~/components/map";*/

const createMap = (
    options: maplibregl.MapOptions,
    sources: Sources,
    layers: Layers,
    images: Images,
    clickHandlers: ClickHandlers,
) => {
    const map = new maplibregl.Map(options);
    return map;
};

const Map = component$(
    ({
        class: clz,
        style = "https://tiles.versatiles.org/assets/styles/colorful.json",
        sources = {},
        layers$ = $([]),
        images = {},
        onClick = [],
    }: {
        /**
         * Classes to set
         */
        class?: ClassList;
        /**
         * The map style. Will default to versatiles colorful
         */
        style?: string;
        /**
         * Datasources to add to the map
         */
        sources?: Sources;
        /**
         * Layers to add to the map
         */
        layers$?: QRL<Layers>;
        /**
         * Images to load into the map
         */
        images?: Images;
        /**
         * Handlers for click events on the map
         */
        onClick?: ClickHandlers;
    }) => {
        const map = useSignal<NoSerialize<maplibregl.Map>>();
        const markSign = useSignal<NoSerialize<maplibregl.Marker>>();
        const containerRef = useSignal<HTMLElement>();
        const coordsLat = useSignal<number>();
        const coordsLng = useSignal<number>();

        useOn(
            "qvisible",
            $(async () => {
                if (!containerRef.value) {
                    console.warn("Map-container does not exist");
                    return;
                }
                const createdMap = createMap(
                    {
                        container: containerRef.value,
                        style: style,
                    },
                    sources,
                    await layers$.resolve(),
                    images,
                    onClick,
                )
                markSign.value = noSerialize(
                    new maplibregl.Marker({ draggable: true })
                        .setLngLat([0, 0])
                        .addTo(createdMap)
                )
                coordsLat.value = markSign.value?.getLngLat().lat
                coordsLng.value = markSign.value?.getLngLat().lng
                /*map.value = noSerialize(
                    createdMap[0],
                );*/
            }),
        );

        return (
            <>
                <div>
                    <div ref={containerRef} class={clz}>
                        Loading map...
                    </div>
                </div>
            </>
        );
    },
);

const Vereinsdaten = component$(() => {
    return (
        <>
            <p>Projektdaten</p>
            <label class="input input-bordered flex items-center gap-2">
                Projektname*
                <input type="text w-full" class="grow" placeholder="Mein Projekt" />
            </label>
            <label class="form-control">
                <div class="label">
                    <span class="label-text">Projektkurzbeschreibung</span>
                </div>
                <textarea class="textarea textarea-bordered h-24" placeholder="Beschreibung"></textarea>
            </label>
            <label class="form-control">
                <div class="label">
                    <span class="label-text">Projektbeschreibung*</span>
                </div>
                <textarea class="textarea textarea-bordered h-24" placeholder="Beschreibung"></textarea>
            </label>
            <label class="form-control">
                <div class="label">
                    <span class="label-text">Projektstandort*</span>
                </div>
                <div class="rounded">
                    <div class="card card-compact bg-base-100 shadow-xl">
                        <figure>
                            <div id="map"></div>
                            <Map class="h-[30rem] w-[40rem] rounded-2xl" />
                        </figure>
                    </div>

                </div>
            </label>
            <label class="form-control w-full max-w">
                <label class="input input-bordered flex items-center gap-2">
                    Projektspendenseite
                    <input type="text" class="grow" />
                </label>
                <div class="label">
                    <span class="label-text-alt"></span>
                    <span class="label-text-alt">*notwendig</span>
                </div>
            </label>
        </>
    )
})

export const ProjectCreation = component$(() => {
    return (
        <>
            <div class="relative flex justify-center">
                <div class="card bg-base-300 rounded-box place-items-stretch m-8 p-8 space-y-4 [max-height:90dvh] w-1/3 min-w-fit ">
                    <h2 class="card-title">Projekterstellung</h2>
                    <div class="overflow-y-auto space-y-4 ">
                        <Vereinsdaten />
                    </div>
                    <div class="card-actions justify-between">
                        <button class="btn btn-error">Abbrechen
                        </button>
                        <button class="btn btn-primary">Speichern
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
})
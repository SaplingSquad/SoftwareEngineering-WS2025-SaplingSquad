import { Session } from "@auth/qwik";
import { ClassList, component$, Signal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { HiUserCircleOutline } from "@qwikest/icons/heroicons";

export const ProfileImage = component$((inputData: { profiledata: Readonly<Signal<null>> | Readonly<Signal<Session>>, imgSize: ClassList }) => {
    return (
        <>

            {
                inputData.profiledata.value?.user?.image ?
                    <>
                        <img class={inputData.imgSize} src={inputData.profiledata.value?.user?.image} />
                    </>
                    :
                    <>
                        <HiUserCircleOutline class={inputData.imgSize} />
                    </>
            }
        </>
    )
})

import { $, noSerialize, NoSerialize, QRL, useOn, useSignal } from "@builder.io/qwik";
import maplibregl from "maplibre-gl";
import { ClickHandlers, Images, Layers, Sources } from "../map";
import { isServer } from "@builder.io/qwik/build";
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

export const MapLocationInput = component$(
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

        useVisibleTask$(
            async () => {
                if (isServer) {
                    return;
                }
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

                markSign.value?.on('dragend', () => {
                    const lngLat = markSign.value?.getLngLat()
                    coordsLng.value = lngLat?.lng
                    coordsLat.value = lngLat?.lat
                })
            },
            { strategy: 'document-ready' }
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
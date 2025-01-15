import { Session } from "@auth/qwik";
import { ClassList, component$, Signal, useVisibleTask$ } from "@builder.io/qwik";
import { HiUserCircleOutline } from "@qwikest/icons/heroicons";
import { $, noSerialize, NoSerialize, QRL, useSignal } from "@builder.io/qwik";
import maplibregl from "maplibre-gl";
import { ClickHandlers, Images, Layers, Sources } from "../map";
import { isServer } from "@builder.io/qwik/build";
import { InputMarkerLocation } from "./types";

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
        location,
        drgbl = false
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
        location: InputMarkerLocation;
        drgbl?: boolean;
    }) => {
        const markSign = useSignal<NoSerialize<maplibregl.Marker>>();
        const containerRef = useSignal<HTMLElement>();

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
                        cooperativeGestures: true,
                        container: containerRef.value,
                        style: style,
                    },
                    sources,
                    await layers$.resolve(),
                    images,
                    onClick,
                )
                markSign.value = noSerialize(
                    new maplibregl.Marker({ draggable: drgbl })
                        .setLngLat([location.lng, location.lat])
                        .addTo(createdMap)
                )

                createdMap.on('click', (e) => {
                    location.lat = e.lngLat.lat
                    location.lng = e.lngLat.lng
                    markSign.value?.setLngLat(e.lngLat)
                })

                markSign.value?.on('dragend', () => {
                    const lngLat = markSign.value?.getLngLat()
                    if (lngLat?.lng) {
                        location.lng = lngLat?.lng
                    }
                    if (lngLat?.lat) {
                        location.lat = lngLat?.lat
                    }
                })
            },
            { strategy: 'document-ready' }
        );

        return (
            <>
                <div ref={containerRef} class={clz}>
                    Loading map...
                </div>
            </>
        );
    },
);
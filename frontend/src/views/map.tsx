import { type Signal, $, component$ } from "@builder.io/qwik";
import type { StyleImageMetadata } from "maplibre-gl";
import { OrganizationInfo } from "~/components/info/organization";
import { ProjectInfo } from "~/components/info/project";
import { Map as MapComponent } from "~/components/map";
import { clickHandlers } from "~/components/map/click_handlers";
import { clusteredPinLayer } from "~/components/map/clustered_pin_layers";
import { clusteredGeoJSONDatasource } from "~/components/map/datasources";

/**
 * Options for the cluster icons
 */
const clusterIconOptions: Partial<StyleImageMetadata> = {
  stretchX: [[98, 281]],
  stretchY: [[98, 281]],
  content: [40, 40, 340, 340],
  pixelRatio: 6,
};

/**
 * Options for the marker icons
 */
const markerIconOptions: Partial<StyleImageMetadata> = {
  content: [40, 40, 340, 340],
  pixelRatio: 1,
};

/**
 * Create a cluster-layer from the passed source
 * @param source the source-id
 * @returns An array of layers that display clusters/markers
 */
const clusteredLayer = (source: string) =>
  clusteredPinLayer(source, {
    markerIcon: `${source}_marker`,
    clusterIcon: `${source}_cluster`,
    clusterFont: "noto_sans_regular",
  });

/**
 * Creates a full map-view, which displays the entities from the database.
 * Will take the full width and height of the parent.
 */
export const Map = component$(
  (props: {
    organizationLocations: Signal<GeoJSON.GeoJSON>;
    projectLocations: Signal<GeoJSON.GeoJSON>;
  }) => {
    const sources = {
      organizations: {
        info: $(() => <OrganizationInfo />),
        data: props.organizationLocations.value,
        iconOptions: {
          marker: markerIconOptions,
          cluster: clusterIconOptions,
        },
      },
      projects: {
        info: $(() => <ProjectInfo />),
        data: props.projectLocations.value,
        iconOptions: {
          marker: markerIconOptions,
          cluster: clusterIconOptions,
        },
      },
    };

    return (
      <MapComponent
        class="h-full w-full"
        images={Object.fromEntries(
          Object.entries(sources).flatMap(([source, { iconOptions }]) =>
            ["marker", "cluster"].map((type) => [
              `${source}_${type}`,
              [
                `/rsc/markers/${source}_${type}.png`,
                iconOptions[type as keyof typeof iconOptions],
              ],
            ]),
          ),
        )}
        sources={Object.fromEntries(
          Object.entries(sources).map(([source, { data }]) => [
            source,
            clusteredGeoJSONDatasource(data),
          ]),
        )}
        layers={Object.keys(sources).flatMap(clusteredLayer)}
        onClick={clickHandlers({
          clusterZoom: Object.keys(sources),
          info: Object.fromEntries(
            Object.entries(sources).map(([source, { info }]) => [source, info]),
          ),
        })}
      />
    );
  },
);

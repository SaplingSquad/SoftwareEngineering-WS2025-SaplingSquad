import { $, component$ } from "@builder.io/qwik";
import type { StyleImageMetadata } from "maplibre-gl";
import { OrganizationInfo } from "~/components/info/organization";
import { ProjectInfo } from "~/components/info/project";
import { RegionInfo } from "~/components/info/region";
import { Map as MapComponent } from "~/components/map";
import { clickHandlers } from "~/components/map/click_handlers";
import { clusteredPinLayer } from "~/components/map/clustered_pin_layers";
import { clusteredGeoJSONDatasource } from "~/components/map/datasources";

/**
 * Generate 10k random points
 * @returns A GeoJSON of 10k random points
 */
const example_geojson = (): GeoJSON.GeoJSON => ({
  type: "FeatureCollection",
  features: [...new Array(10_000).keys()].map(() => ({
    type: "Feature",
    properties: {
      assocId: Math.floor(Math.random() * 100_000),
    },
    geometry: {
      type: "Point",
      coordinates: [Math.random() * 360 - 180, Math.random() * 360 - 180],
    },
  })),
});

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
 * The sources to use and some additional properties
 */
const sources = {
  organizations: {
    info: $(() => <OrganizationInfo />),
    data: example_geojson(),
    iconOptions: {
      marker: markerIconOptions,
      cluster: clusterIconOptions,
    },
  },
  projects: {
    info: $(() => <ProjectInfo />),
    data: example_geojson(),
    iconOptions: {
      marker: markerIconOptions,
      cluster: clusterIconOptions,
    },
  },
  regions: {
    info: $(() => <RegionInfo />),
    data: example_geojson(),
    iconOptions: {
      marker: markerIconOptions,
      cluster: clusterIconOptions,
    },
  },
};

/**
 * Creates a full map-view, which displays the entities from the database.
 * Will take the full width and height of the parent.
 */
export const Map = component$(() => {
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
});

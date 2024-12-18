import type { ClassList, NoSerialize } from '@builder.io/qwik';
import { component$, noSerialize, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

/**
 * Component to display a map using MapLibreGL.
 */
export const Map = component$(({
  class: clz,
  style = 'https://tiles.versatiles.org/assets/styles/colorful.json',
}: {
  /**
   * Classes to set
   */
  class?: ClassList,
  /**
   * The map style. Will default to versatiles colorful
   */
  style?: string,
}) => {
  const map = useSignal<NoSerialize<maplibregl.Map>>();
  const containerRef = useSignal<HTMLElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (!containerRef.value) {
      console.warn("Map-container does not exist");
      return;
    }
    map.value = noSerialize(new maplibregl.Map({
      container: containerRef.value,
      style: style
    }));
  });

  return <div ref={containerRef} class={clz}>Loading map...</div>
});

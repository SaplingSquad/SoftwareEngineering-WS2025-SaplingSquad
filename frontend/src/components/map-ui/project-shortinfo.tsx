import {
  type QRL,
  component$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import {
  HiBuildingOfficeOutline,
  HiCalendarOutline,
  HiMapPinOutline,
  HiTagOutline,
} from "@qwikest/icons/heroicons";
import { layoutTags } from "./tag-layout";
import type { Project } from "./map-ui";

/**
 * A small card for the list view showing the most important information about a project.
 */
export const ProjectShortInfo = component$(
  (props: { project: Project; onClick: QRL<() => void> }) => {
    const tagContainerRef = useSignal<HTMLDivElement>({} as HTMLDivElement);

    // Use visible task because the tags need to be layouted every time the component is re-rendered.
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() =>
      layoutTags(
        tagContainerRef,
        props.project.tags.map(() => "Umweltschutz"),
      ),
    ); // TODO

    return (
      <div
        class="group card cursor-pointer space-y-2 bg-base-200 p-4 hover:bg-base-300 active:scale-[0.99]"
        onClick$={props.onClick}
      >
        <h1 class="text-xl font-bold text-primary">{props.project.name}</h1>
        <div class="flex h-min max-w-full justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center space-x-1">
              <HiBuildingOfficeOutline />
              <span>{props.project.orgaName}</span>
            </div>
            <div class="flex items-center space-x-1">
              <HiMapPinOutline />
              <span>{props.project.regionName}</span>
            </div>
            <div class="flex items-center space-x-1">
              <HiCalendarOutline />
              <span>
                {props.project.dateFrom} - {props.project.dateTo}
              </span>
            </div>
            <div class="flex items-center space-x-1">
              <HiTagOutline />
              <div
                ref={tagContainerRef}
                class="flex w-64 space-x-1 overflow-hidden"
              ></div>
            </div>
          </div>
          <img
            src={props.project.iconUrl}
            alt="Logo des Projektes bzw. des Vereines, falls das Projekt kein eigenes Logo hat"
            height={104}
            width={104}
          />
        </div>
      </div>
    );
  },
);

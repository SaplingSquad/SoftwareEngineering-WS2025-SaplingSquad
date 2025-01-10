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

export type Project = {
  title: string;
  description: string;
  orgIcon: string;
  location: string;
  tags: string[];
};

/**
 * A small card for the list view showing the most important information about a project.
 */
export const ProjectShortInfo = component$(
  (props: { project: Project; onClick: QRL<() => void> }) => {
    const tagContainerRef = useSignal<HTMLDivElement>({} as HTMLDivElement);

    // Use visible task because the tags need to be layouted every time the component is re-rendered.
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => layoutTags(tagContainerRef, props.project.tags));

    return (
      <div
        class="group card cursor-pointer space-y-2 bg-base-200 p-4 hover:bg-base-300 active:scale-[0.99]"
        onClick$={props.onClick}
      >
        <h1 class="text-xl font-bold text-primary">{props.project.title}</h1>
        <div class="flex h-min max-w-full justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center space-x-1">
              <HiBuildingOfficeOutline />
              <span>New Roots</span>
            </div>
            <div class="flex items-center space-x-1">
              <HiMapPinOutline />
              <span>{props.project.location}</span>
            </div>
            <div class="flex items-center space-x-1">
              <HiCalendarOutline />
              <span>2020 - 2025</span>
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
            src={props.project.orgIcon}
            alt="Logo des Vereins, der das Projekt betreibt"
            height={104}
            width={104}
          />
        </div>
      </div>
    );
  },
);

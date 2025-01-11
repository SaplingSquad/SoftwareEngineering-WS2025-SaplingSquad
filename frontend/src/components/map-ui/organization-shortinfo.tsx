import {
  type QRL,
  component$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import {
  HiBoltOutline,
  HiCakeOutline,
  HiHomeOutline,
  HiTagOutline,
  HiUserGroupOutline,
} from "@qwikest/icons/heroicons";
import { layoutTags } from "./tag-layout";
import type { Organization } from "./map-ui";

/**
 * A small card for the list view showing the most important information about an organization.
 */
export const OrganizationShortInfo = component$(
  (props: { org: Organization; onClick: QRL<() => void> }) => {
    const tagContainerRef = useSignal<HTMLDivElement>({} as HTMLDivElement);

    // Use visible task because the tags need to be layouted every time the component is re-rendered.
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() =>
      layoutTags(
        tagContainerRef,
        props.org.tags.map(() => "Umweltschutz"),
      ),
    ); // TODO

    return (
      <div
        class="group card cursor-pointer space-y-2 bg-base-200 p-4 hover:bg-base-300 active:scale-[0.99]"
        onClick$={props.onClick}
      >
        <h1 class="text-xl font-bold text-info">{props.org.name}</h1>
        <div class="flex h-min max-w-full justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center space-x-1">
              <HiHomeOutline />
              <span>{props.org.regionName}</span>
            </div>
            <div class="flex items-center space-x-1">
              <HiCakeOutline />
              <span>{props.org.foundingYear} gegründet</span>
            </div>
            <div class="flex items-center space-x-1">
              <HiUserGroupOutline />
              <span>
                {props.org.memberCount +
                  " " +
                  (props.org.memberCount == 1 ? "Mitglied" : "Mitglieder")}
              </span>
            </div>
            <div class="flex items-center space-x-1">
              <HiBoltOutline />
              <span>
                {props.org.numProjects +
                  " " +
                  (props.org.numProjects == 1 ? "Projekt" : "Projekte")}
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
            src={props.org.iconUrl}
            alt="Logo des Vereins"
            height={104}
            width={104}
          />
        </div>
      </div>
    );
  },
);

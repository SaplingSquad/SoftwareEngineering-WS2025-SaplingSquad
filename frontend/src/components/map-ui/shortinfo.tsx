import {
  type JSXOutput,
  type QRL,
  component$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { layoutTags } from "./tag-layout";
import type { Organization, Project, RankingEntry } from "./types";
import {
  HiBoltOutline,
  HiBuildingOfficeOutline,
  HiCakeOutline,
  HiCalendarOutline,
  HiHomeOutline,
  HiMapPinOutline,
  HiTagOutline,
  HiUserGroupOutline,
} from "@qwikest/icons/heroicons";
import { getTagNames } from "~/utils";

type Detail = { icon: JSXOutput; text: string };

/**
 * Get various details about a project that should be displayed.
 * @param project The project to extract the values of the details from.
 * @returns An array of details, each consisting of an icon and the text it accompanies.
 */
function getProjectDetails(project: Project): Detail[] {
  return [
    { icon: <HiBuildingOfficeOutline />, text: project.orgaName },
    { icon: <HiMapPinOutline />, text: project.regionName },
    {
      icon: <HiCalendarOutline />,
      text: project.dateFrom + " - " + project.dateTo,
    },
  ];
}

/**
 * Get various details about an organization that should be displayed.
 * @param project The organization to extract the values of the details from.
 * @returns An array of details, each consisting of an icon and the text it accompanies.
 */
function getOrganizationDetails(organization: Organization): Detail[] {
  return [
    { icon: <HiHomeOutline />, text: organization.regionName },
    { icon: <HiCakeOutline />, text: organization.foundingYear + " gegründet" },
    {
      icon: <HiUserGroupOutline />,
      text:
        organization.memberCount +
        " " +
        (organization.memberCount == 1 ? "Mitglied" : "Mitglieder"),
    },
    {
      icon: <HiBoltOutline />,
      text:
        organization.projectCount +
        " " +
        (organization.projectCount == 1 ? "Projekt" : "Projekte"),
    },
  ];
}

/**
 * A small card for the list view showing the most important information about a ranking entry.
 */
export const ShortInfo = component$(
  (props: { entry: RankingEntry; onClick: QRL<() => void> }) => {
    const tagContainerRef = useSignal<HTMLDivElement>({} as HTMLDivElement);

    // Use visible task because the tags need to be layouted every time the component is re-rendered.
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async () => {
      tagContainerRef.value.replaceChildren();
      layoutTags(tagContainerRef, await getTagNames(props.entry.content.tags));
    });

    return (
      <div
        class="card cursor-pointer space-y-2 bg-base-200 p-4 hover:brightness-95 active:scale-[0.99]"
        onClick$={props.onClick}
      >
        <h1
          class={[
            "text-xl font-bold",
            props.entry.type === "Organization" ? "text-info" : "text-primary",
          ]}
        >
          {props.entry.content.name}
        </h1>
        <div class="flex h-min max-w-full items-center justify-between">
          <div class="space-y-0.5">
            {(props.entry.type === "Organization"
              ? getOrganizationDetails(props.entry.content)
              : getProjectDetails(props.entry.content)
            ).map((detail, idx) => (
              <div
                key={
                  props.entry.type + "_" + props.entry.content.id + "_" + idx
                }
                class="flex items-center space-x-1"
              >
                {detail.icon}
                <span>{detail.text}</span>
              </div>
            ))}
            <div class="flex items-center space-x-1">
              <HiTagOutline />
              <div
                ref={tagContainerRef}
                class="flex h-7 w-64 space-x-1 overflow-hidden text-nowrap"
              >
                <div class="skeleton h-7 w-20" />
                <div class="skeleton h-7 w-28" />
                <div class="skeleton h-7 w-10" />
              </div>
            </div>
          </div>
          <div class="flex h-[104px] w-[104px] items-center justify-center overflow-hidden rounded-md bg-[white] shadow-sm">
            <img
              src={props.entry.content.iconUrl}
              alt={
                props.entry.type === "Organization"
                  ? "Logo des Vereins"
                  : "Logo des Projektes bzw. des Vereines, falls das Projekt kein eigenes Logo hat"
              }
              height={104}
              width={104}
            />
          </div>
        </div>
      </div>
    );
  },
);

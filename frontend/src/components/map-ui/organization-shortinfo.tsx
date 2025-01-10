import {
  type QRL,
  component$,
  useOnDocument,
  useSignal,
} from "@builder.io/qwik";
import {
  HiBoltOutline,
  HiCakeOutline,
  HiHomeOutline,
  HiTagOutline,
  HiUserGroupOutline,
} from "@qwikest/icons/heroicons";
import { layoutTags } from "./tag-layout";

export type Organization = {
  title: string;
  description: string;
  orgIcon: string;
  foundingYear: number;
  memberCount: number;
  projects: number[];
  tags: string[];
};

/**
 * A small card for the list view showing the most important information about an organization.
 */
export const OrganizationShortInfo = component$(
  (props: { org: Organization; onClick: QRL<() => void> }) => {
    const tagContainerRef = useSignal<HTMLDivElement>({} as HTMLDivElement);

    useOnDocument(
      "DOMContentLoaded",
      layoutTags(tagContainerRef, props.org.tags),
    );

    return (
      <div
        class="group card cursor-pointer space-y-2 bg-base-200 p-4 hover:bg-base-300 active:scale-[0.99]"
        onClick$={props.onClick}
      >
        <h1 class="text-xl font-bold text-primary">{props.org.title}</h1>
        <div class="flex h-min max-w-full justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center space-x-1">
              <HiHomeOutline />
              <span>München, Deutschland</span>
            </div>
            <div class="flex items-center space-x-1">
              <HiCakeOutline />
              <span>{props.org.foundingYear} gegründet</span>
            </div>
            <div class="flex items-center space-x-1">
              <HiUserGroupOutline />
              <span>{props.org.memberCount} Mitglieder</span>
            </div>
            <div class="flex items-center space-x-1">
              <HiBoltOutline />
              <span>
                {props.org.projects.length +
                  (props.org.projects.length > 1 ? " Projekte" : " Projekt")}
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
            src={props.org.orgIcon}
            alt="Logo des Vereins"
            height={130}
            width={130}
          />
        </div>
      </div>
    );
  },
);

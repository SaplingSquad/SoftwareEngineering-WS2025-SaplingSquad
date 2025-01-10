import { type QRL, component$ } from "@builder.io/qwik";
import {
  HiBuildingOfficeOutline,
  HiCalendarOutline,
  HiHomeOutline,
  HiMapPinOutline,
  HiTagOutline,
  HiUserGroupOutline,
} from "@qwikest/icons/heroicons";

export type Project = {
  title: string;
  description: string;
  orgIcon: string;
  location: string;
  tags: string[];
};

export const ProjectShortInfo = component$(
  (props: { project: Project; onClick: QRL<() => void> }) => {
    return (
      <div
        class="group card flex cursor-pointer flex-row items-center space-x-4 bg-base-200 p-2 hover:bg-base-300 active:scale-[0.99]"
        onClick$={props.onClick}
      >
        <img
          src={props.project.orgIcon}
          alt="Logo des Vereins, der das Projekt betreibt"
          class="size-32"
          height={256}
          width={256}
        />
        <div>
          <h1 class="text-xl font-bold text-primary">{props.project.title}</h1>
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
              <Tag name={props.project.tags[0]} />
              {props.project.tags.length > 1 && (
                <Tag name={props.project.tags[1]} />
              )}
              {props.project.tags.length > 2 && (
                <Tag name={"+" + (props.project.tags.length - 2).toString()} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

const Tag = component$((props: { name: string }) => {
  return (
    <div class="rounded-full border border-primary bg-primary-content px-2 text-primary group-hover:brightness-90">
      {props.name}
    </div>
  );
});

export type Organization = {
  title: string;
  description: string;
  orgIcon: string;
  memberCount: number;
};

export const OrganizationShortInfo = component$(
  (props: { org: Organization }) => {
    return (
      <div class="card flex cursor-pointer flex-row space-x-2 bg-base-200 p-2 hover:bg-base-300 active:scale-[0.99]">
        <img
          src={props.org.orgIcon}
          alt="Logo des Vereins"
          class="size-32"
          height={256}
          width={256}
        />
        <div>
          <h1 class="text-xl font-bold text-info">{props.org.title}</h1>
          <div class="space-y-0.5">
            <div class="flex items-center space-x-1">
              <HiHomeOutline />
              <span>München, Deutschland</span>
            </div>
            <div class="flex items-center space-x-1">
              <HiUserGroupOutline />
              <span>{props.org.memberCount}</span>
            </div>
          </div>
        </div>
        <div class="absolute bottom-2 right-2">
          <button class="btn btn-info btn-sm">Projekte entdecken</button>
          {/* Probably unneccessary, as it can be reached throgh the expanded view */}
        </div>
      </div>
    );
  },
);

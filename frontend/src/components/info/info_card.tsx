import type { ClassList, Component, JSXOutput, QRL } from "@builder.io/qwik";
import { $, component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { PreviewMap } from "../map";
import { ApiRequest } from "../api";
import { useGetTags } from "~/api/api_hooks.gen";
import { toMapping } from "~/api/tags";
import { isNumberArray } from "~/utils";

/**
 * A generic info-card for any entity.
 * Can display multiple different parts, most of which are optional.
 * Tries to layout the content to be as responsive as possible.
 * Looks best with as many options set as possible.
 *
 * Named slots:
 * - `properties`: Shows some short-properties of the entity
 * - `aside`: Allows showing some additional content. Set `aside` is this section should be shown.
 * - `actions`: Buttons at the bottom of the card. Use {@link ActionButton} for buttons with icons that are automatically inserted here.
 */
export const InfoCard = component$(
  ({
    icon,
    name,
    images,
    description,
    location,
    tags,
    aside = false,
  }: {
    /**
     * Name of the entity
     */
    name: string;
    /**
     * Icon of the entity
     */
    icon: string;
    /**
     * Images of the entity to show in a little gallery.
     * Must be a non-empty array to be displayed.
     */
    images?: string[];
    /**
     * Long description of the entity
     */
    description?: string;
    /**
     * Location of the entity to show in a {@link MapPreview}
     */
    location?: [number, number];
    /**
     * Tags of the entity
     */
    tags?: string[] | number[];
    /**
     * Whether the `aside`-section should be shown
     */
    aside?: boolean;
  }) => {
    return (
      <article class="card w-full bg-base-100 shadow-xl">
        {/* Location Preview */}
        {location && (
          <aside class="flex w-full shrink grow basis-64 flex-col rounded-t-box bg-base-200">
            <PreviewMap
              coordinates={location}
              class="grow basis-48 rounded-t-box"
              color="#386641"
            />
          </aside>
        )}
        {/* Main content */}
        <div class="card-body gap-4">
          {/* Header */}
          <div class="flex flex-row flex-wrap-reverse items-end justify-around gap-4">
            {/* Avatar (Icon) */}
            <div class="avatar">
              <div class="w-24 rounded-box">
                <img
                  src={icon}
                  alt={`Icon von ${name}`}
                  // Default size; will be overwritten by css
                  width="1"
                  height="1"
                />
              </div>
            </div>
            <div class="flex min-w-64 shrink grow basis-64 flex-col justify-around">
              {/* Name */}
              <h2 class="card-title text-3xl">{name}</h2>
              <div class="flex w-full flex-row flex-wrap items-center gap-4">
                {/* Properties */}
                <Slot name="properties" />
                {/* Tags */}
                {tags &&
                  (isNumberArray(tags) ? (
                    <LoadTags tags={tags} />
                  ) : (
                    <DisplayTags tags={tags} />
                  ))}
              </div>
            </div>
          </div>
          {/* Main content */}
          <div class="items-top flex min-h-96 flex-wrap justify-around gap-4 xl:gap-8">
            {/* Description */}
            {description && (
              <div class="xl:prose-lg prose w-full shrink grow basis-80 rounded-box bg-base-200 p-4 text-justify xl:px-8">
                {description.split("\n").map((line) => (
                  <p key={line} class="min-h-1">
                    {line}
                  </p>
                ))}
              </div>
            )}
            {/* Images */}
            {images && images.length > 0 && (
              <aside class="flex w-full shrink grow basis-64 flex-col rounded-box bg-base-200 p-2">
                <div class="flex grow basis-48 flex-row flex-wrap items-stretch justify-between gap-4 overflow-y-auto rounded-xl">
                  {images.map((image, idx) => (
                    <img
                      src={image}
                      key={image}
                      alt={`Bild von ${name} (${idx})`}
                      // Default size; will be overwritten by css
                      width="192"
                      height="108"
                      class="h-auto max-h-96 min-h-8 w-auto min-w-8 shrink grow rounded-lg object-cover"
                    />
                  ))}
                </div>
              </aside>
            )}
            {/* Aside (additional content) */}
            {aside && (
              <aside class="flex w-full shrink grow basis-64 flex-col rounded-box bg-base-200 p-2">
                <div class="flex grow basis-96 flex-col gap-2 overflow-y-scroll rounded-xl">
                  <Slot name="aside" />
                </div>
              </aside>
            )}
          </div>
          {/* Actions */}
          <div class="align-center card-actions justify-stretch">
            <Slot name="actions" />
          </div>
        </div>
      </article>
    );
  },
);

/**
 * Load tag-mapping and display the tags by ID.
 */
export const LoadTags = component$(({ tags }: { tags: number[] }) => (
  <ApiRequest
    hook$={$(useGetTags)}
    args={[]}
    on200$={(response) => {
      const mapping = toMapping(response);
      return (
        <DisplayTags tags={tags.map((t) => mapping[t] ?? "Unbekannter Tag")} />
      );
    }}
    defaultError$={() => "Tags konnten nicht geladen werden"}
  />
));

/**
 * Display the passed tags
 */
const DisplayTags = component$(({ tags }: { tags: string[] }) => (
  <div class="flex flex-row flex-wrap gap-2">
    {tags.map((tag) => (
      <div
        key={tag}
        class="badge badge-secondary badge-md grow-[0.1] text-secondary-content"
      >
        {tag}
      </div>
    ))}
  </div>
));

/**
 * A button with an icon.
 * Text can be contained as a child.
 *
 * Use as a JSX-component.
 */
export const ActionButton: Component<{
  /**
   * Icon to display. Must accept classes.
   */
  icon?: Component<{ class?: ClassList }>;
  /**
   * URL to link to
   */
  url: string;
  /**
   * Optional click-handler.
   * When this is set, clicking this button will not navigate to the set `QRL`,
   * but only call the click-handler instead.
   */
  onClick$?: QRL<
    (pointerEvent: PointerEvent, anchorEvent: HTMLAnchorElement) => unknown
  >;
  /**
   * Other content of this button
   */
  children?: JSXOutput;
}> = ({ icon: Icon, url, onClick$, children }) => {
  return (
    <Link
      q:slot="actions"
      href={url}
      preventdefault:click={onClick$ !== undefined}
      onClick$={onClick$ && ((pe, ae) => onClick$(pe, ae))}
      class="btn btn-primary min-w-min grow basis-0"
    >
      {Icon && <Icon class="mr-2 h-8 w-8" />}
      {children}
    </Link>
  );
};

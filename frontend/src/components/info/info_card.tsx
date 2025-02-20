import type { ClassList, Component, JSXOutput, QRL } from "@builder.io/qwik";
import { $, component$, Slot } from "@builder.io/qwik";
import { PreviewMap } from "../map";
import { ApiRequest } from "../api";
import { HiArrowLeftOutline, HiXMarkOutline } from "@qwikest/icons/heroicons";
import { useGetTags } from "~/api/api_hooks.gen";
import { toMapping } from "~/api/tags";
import { isNumberArray } from "~/utils";
import type { BookmarkProps } from "../bookmark";
import { BookmarkButton } from "../bookmark";
import type { LinkTarget } from "../link_button";
import { IconLinkButton, LinkButton } from "../link_button";
import { Div } from "../div";

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
    onClose,
    onBack,
    bookmarked,
    onSetBookmarked$,
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
    /**
     * Optionally display a close-button. See {@link LinkTarget}.
     */
    onClose?: LinkTarget;
    /**
     * Optionally show a back-button. See {@link LinkTarget}.
     */
    onBack?: LinkTarget;
  } & Partial<BookmarkProps>) => {
    return (
      <article class="card relative w-full bg-base-100 shadow-xl">
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
              <h2 class="card-title flex flex-row items-center gap-x-2 text-3xl">
                {name}
                {/* Bookmark-Button */}
                {bookmarked !== undefined && (
                  <BookmarkButton
                    bookmarked={bookmarked}
                    onSetBookmarked$={onSetBookmarked$ ?? $(() => {})}
                  />
                )}
              </h2>
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
          <div class="align-center card-actions items-stretch justify-stretch">
            <Slot name="actions" />
          </div>
        </div>
        {/* Close Button */}
        {onClose && (
          <IconLinkButton
            target={onClose}
            class="absolute right-2 top-2"
            Icon={HiXMarkOutline}
          />
        )}
        {/* Back Button */}
        {onBack && (
          <IconLinkButton
            target={onBack}
            class="absolute left-2 top-2"
            Icon={HiArrowLeftOutline}
          />
        )}
        <Slot />
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
 * Will be rendered in actions in {@link InfoCard}.
 *
 * Use as a JSX-component.
 */
export const ActionButton = ({
  icon: Icon,
  url,
  onClick$,
  children,
}: {
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
  onClick$?: QRL<() => unknown>;
  /**
   * Other content of this button
   */
  children?: JSXOutput;
}) => (
  <LinkButton
    q:slot="actions"
    target={onClick$ ? [url, onClick$] : url}
    class="btn btn-primary max-w-full grow flex-nowrap"
  >
    {Icon && <Icon class="mr-2 h-8 w-8" />}
    {children}
  </LinkButton>
);

/**
 * A component for displaying a property (`value`) with an `Icon` in {@link InfoCard}.
 * Will only display when `value` is not `undefined`.
 */
export const IconProperty = ({
  value,
  Icon,
}: {
  value: string | undefined;
  Icon: Component<{ class?: ClassList }>;
}) =>
  value && (
    // Need `Div` here so that qwik correctly uses the `q:slot`.
    <Div q:slot="properties" class="flex flex-row items-center gap-2">
      <Icon />
      {value}
    </Div>
  );

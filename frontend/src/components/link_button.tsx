import type { ClassList, Component, QRL } from "@builder.io/qwik";
import { component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

/**
 * Something that is a target of a link.
 * Either a url to the target-page,
 * a handler,
 * or a url and a handler (will prevent navigation on click and only call the QRL;
 * still allows interacting like a normal link on e.g., right-click).
 *
 * If there is a URL that would open the same page as what is displayed when the click-handler is called,
 * always pass the URL as well.
 */
export type LinkTarget =
  | string
  | QRL<() => unknown>
  | [string, QRL<() => unknown>];

/**
 * Shows a button to a {@link LinkTarget} with an `Icon`.
 */
export const IconLinkButton = ({
  /**
   * {@link LinkTarget}
   */
  target,
  /**
   * Additional classes to set
   */
  class: clz,
  /**
   * Icon to render
   */
  Icon,
}: {
  target: LinkTarget;
  class?: ClassList;
  Icon: Component<{ class: ClassList }>;
}) => {
  return (
    <LinkButton target={target} class={["btn btn-circle btn-ghost", clz]}>
      <Icon class="h-7 w-7" />
    </LinkButton>
  );
};

/**
 * Shows a button to a {@link LinkTarget}.
 * Does not apply any classes; set from outside in `class`.
 */
export const LinkButton = component$(
  ({
    /**
     * {@link LinkTarget}
     */
    target,
    /**
     * Additional classes to set
     */
    class: clz,
  }: {
    target: LinkTarget;
    class?: ClassList;
  }) => {
    if (typeof target === "string") {
      // URL
      return (
        <Link href={target} class={clz}>
          <Slot />
        </Link>
      );
    } else if (Array.isArray(target)) {
      // URL and handler
      return (
        <a
          href={target[0]}
          class={clz}
          preventdefault:click
          onClick$={target[1]}
        >
          <Slot />
        </a>
      );
    } else {
      // Handler
      return (
        <button class={clz} onClick$={target}>
          <Slot />
        </button>
      );
    }
  },
);

import type { ClassList, Component, QRL } from "@builder.io/qwik";
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
  const insides = <Icon class="h-7 w-7" />;
  const btnClass = "btn btn-circle btn-ghost";
  if (typeof target === "string") {
    // URL
    return (
      <Link href={target} class={[btnClass, clz]}>
        {insides}
      </Link>
    );
  } else if (Array.isArray(target)) {
    // URL and handler
    return (
      <a
        href={target[0]}
        class={[btnClass, clz]}
        preventdefault:click
        onClick$={target[1]}
      >
        {insides}
      </a>
    );
  } else {
    // Handler
    return (
      <button class={[btnClass, clz]} onClick$={target}>
        {insides}
      </button>
    );
  }
};

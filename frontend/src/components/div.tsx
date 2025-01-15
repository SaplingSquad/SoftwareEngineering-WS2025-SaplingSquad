import type { HTMLAttributes } from "@builder.io/qwik";
import { component$, Slot } from "@builder.io/qwik";

/**
 * When you need a `div` as a qwik-element.
 * Trust me, this is needed sometimes.
 *
 * Example uses:
 * - Setting the slot-name on an element that is a child of a non-qwik element
 */
export const Div = component$((props: HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>
    <Slot />
  </div>
));

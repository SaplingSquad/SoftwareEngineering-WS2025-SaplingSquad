import type { JSXOutput, QRL } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";

/**
 * Converts a {@link QRL} that returns a component into a component.
 * Needed when the output of the {@link QRL} needs to be returned as a non-{@link Promise}.
 */
export const FromQrl = component$(
  <Args extends any[]>({
    fn$,
    args,
  }: {
    fn$: QRL<(...args: Args) => JSXOutput>;
    args: Args;
  }) => {
    return <>{fn$(...args)}</>;
  },
);

import { type Signal, $, component$, useSignal } from "@builder.io/qwik";
import type { Ranking } from "./types";
import { ShortInfo } from "./shortinfo";

export const LazyLoader = component$(
  (props: {
    ranking: Signal<Ranking[]>;
    selectedRanking: Signal<Ranking | undefined>;
  }) => {
    const numShown = useSignal<number>(10);
    const scrollContainer = useSignal<HTMLDivElement>();

    return (
      <div
        ref={scrollContainer}
        class="h-full space-y-2 overflow-y-auto pr-2"
        onScroll$={$(() => {
          if (numShown.value >= props.ranking.value.length) return;

          const maxScroll = scrollContainer.value!.scrollHeight;
          const currentScroll =
            scrollContainer.value!.scrollTop +
            scrollContainer.value!.offsetTop +
            window.innerHeight;

          if (currentScroll + 100 >= maxScroll) {
            numShown.value += 10;
          }
        })}
      >
        {(numShown.value >= props.ranking.value.length
          ? props.ranking.value
          : props.ranking.value.slice(0, numShown.value)
        ).map((ranking) => (
          <ShortInfo
            key={ranking.entry.type + "_" + ranking.entry.content.id}
            entry={ranking.entry}
            onClick={$(() => {
              props.selectedRanking.value = ranking;
            })}
          />
        ))}
      </div>
    );
  },
);

import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="bg-base flex h-screen w-screen flex-col items-center justify-center">
      <h1 class="mb-8 text-center text-5xl font-bold text-primary">
        Willkommen zu Sprout!
      </h1>
      <h2 class="mx-48 mb-8 text-center text-3xl font-bold text-primary">
        Möchtest du direkt zur Karte oder zuerst deine Präferenzen angeben,
        damit wir dich bei deiner Suche unterstützen können?
      </h2>
      <div class="flex w-3/4 space-x-16">
        <a
          href="/questions"
          class="transform-all card grow bg-primary hover:scale-105 active:scale-[1.02] transition-all"
        >
          <h3 class="my-2 text-center text-xl font-bold text-primary-content">
            Präferenzen angeben
          </h3>
          <figure>
            <img
              src="https://picsum.photos/300"
              alt=""
              class="h-full w-full"
              height="4096"
              width="4096"
            />
          </figure>
        </a>
        <div class="divider divider-primary divider-horizontal">ODER</div>
        <a
          href="/map"
          class="transform-all card grow bg-primary hover:scale-105 active:scale-[1.02] transition-all"
        >
          <h3 class="my-2 text-center text-xl font-bold text-primary-content">
            Direkt zur Karte
          </h3>
          <figure>
            <img
              src="https://picsum.photos/300"
              alt=""
              class="h-full w-full"
              height="4096"
              width="4096"
            />
          </figure>
        </a>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sprout",
  meta: [
    {
      name: "description",
      content:
        "Sprout allows you to find projects and organizations to donate to",
    },
  ],
};

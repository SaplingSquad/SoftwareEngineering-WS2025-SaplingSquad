import { type QRL, component$ } from "@builder.io/qwik";
import type { Project } from "./project-shortinfo";
import { HiXMarkOutline } from "@qwikest/icons/heroicons";

export const ProjectLargeInfo = component$(
  (props: { project: Project; onClose: QRL<() => void> }) => {
    return (
      <div class="card h-full w-[600px] bg-base-100 p-4 pt-6">
        <div class="space-y-4">
          <h1 class="text-center text-3xl font-bold">{props.project.title}</h1>
          <Carousel />
          <p>{props.project.description}</p>
          <div>
            <img
              src={props.project.orgIcon}
              alt="Logo des Vereins, der das Projekt betreibt"
              class="size-16"
              height={256}
              width={256}
            />
            New Roots
          </div>
          {props.project.tags}
        </div>
        <div class="fixed right-6 top-6">
          <HiXMarkOutline
            class="size-10 hover:stroke-error"
            onClick$={props.onClose}
          />
        </div>
      </div>
    );
  },
);

const Carousel = component$(() => {
  return (
    <div class="carousel carousel-center space-x-4 rounded-box">
      <div class="carousel-item">
        <img src="https://picsum.photos/300?x=1" class="rounded-box" />
      </div>
      <div class="carousel-item">
        <img src="https://picsum.photos/300?x=2" class="rounded-box" />
      </div>
      <div class="carousel-item">
        <img src="https://picsum.photos/300?x=3" class="rounded-box" />
      </div>
      <div class="carousel-item">
        <img src="https://picsum.photos/300?x=4" class="rounded-box" />
      </div>
      <div class="carousel-item">
        <img src="https://picsum.photos/300?x=5" class="rounded-box" />
      </div>
      <div class="carousel-item">
        <img src="https://picsum.photos/300?x=6" class="rounded-box" />
      </div>
      <div class="carousel-item">
        <img src="https://picsum.photos/300?x=7" class="rounded-box" />
      </div>
    </div>
  );
});

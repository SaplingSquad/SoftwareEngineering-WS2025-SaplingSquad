import { component$, useSignal } from "@builder.io/qwik";
import {
  HiBars3Outline,
  HiBookmarkOutline,
  HiMagnifyingGlassOutline,
} from "@qwikest/icons/heroicons";
import SproutIcon from "~/../public/Sprout_icon.png?jsx";

export const MapMenu = component$(() => {
  const searchActive = useSignal<boolean>(false);
  const booksmarksActive = useSignal<boolean>(false);
  const listActive = useSignal<boolean>(false);

  return (
    <>
      <div class="navbar fixed top-0 m-4 w-1/5 min-w-fit rounded-box bg-base-100">
        <div class="navbar-start">
          <a href="/" class="btn btn-ghost flex items-center text-2xl">
            <SproutIcon class="h-6 w-6" />
            Sprout
          </a>
        </div>
        <div class="navbar-center"></div>
        <div class="navbar-end">
          <input
            type="text"
            placeholder="Suche hier"
            class={[
              "rounded-full border px-4 py-2",
              searchActive.value ? "" : "invisible",
            ]}
            onKeyDown$={(event) => {
              if (event.key == "Enter") {
                listActive.value = true;
              }
            }}
          />
          <button
            class="btn btn-circle btn-ghost"
            onClick$={() => (searchActive.value = !searchActive.value)}
          >
            <HiMagnifyingGlassOutline
              class={["size-6", searchActive.value ? "fill-black" : ""]}
            />
          </button>
          <button
            class="btn btn-circle btn-ghost"
            onClick$={() => (booksmarksActive.value = !booksmarksActive.value)}
          >
            <HiBookmarkOutline
              class={["size-6", booksmarksActive.value ? "fill-black" : ""]}
            />
          </button>
        </div>
      </div>
      {listActive.value ? (
        <div class="fixed left-4 top-24 max-h-[800px] overflow-auto rounded-box bg-base-100 shadow-2xl">
          <div class="m-4 h-32 w-96 rounded-box bg-base-200 p-4">
            Hello world
          </div>
          <div class="m-4 h-32 w-96 rounded-box bg-base-200 p-4">
            Hello world
          </div>
          <div class="m-4 h-32 w-96 rounded-box bg-base-200 p-4">
            Hello world
          </div>
          <div class="m-4 h-32 w-96 rounded-box bg-base-200 p-4">
            Hello world
          </div>
          <div class="m-4 h-32 w-96 rounded-box bg-base-200 p-4">
            Hello world
          </div>
          <div class="m-4 h-32 w-96 rounded-box bg-base-200 p-4">
            Hello world
          </div>
          <div class="m-4 h-32 w-96 rounded-box bg-base-200 p-4">
            Hello world
          </div>
          <div class="m-4 h-32 w-96 rounded-box bg-base-200 p-4">
            Hello world
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );

  return (
    <>
      <div class="navbar fixed top-0 m-4 w-1/5 min-w-fit rounded-box bg-base-100">
        <div class="navbar-start">
          <div class="dropdown">
            <div tabIndex={0} role="button" class="btn btn-circle btn-ghost">
              <HiBars3Outline class="size-6" />
            </div>
            <ul
              tabIndex={0}
              class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <a href="/questions">Questions</a>
              </li>
              <li>
                <a href="/">About</a>
              </li>
            </ul>
          </div>
          <button
            class="btn btn-circle btn-ghost"
            onClick$={() =>
              (booksmarksSelected.value = !booksmarksSelected.value)
            }
          >
            <HiBookmarkOutline
              class={["size-6", booksmarksSelected.value ? "fill-black" : ""]}
            />
          </button>
        </div>
        <div class="navbar-center">
          <a href="/" class="btn btn-ghost flex items-center text-2xl">
            <SproutIcon class="h-6 w-6" />
            Sprout
          </a>
        </div>
        <div class="navbar-end">
          <button class="btn btn-circle btn-ghost">
            <HiMagnifyingGlassOutline class="size-6" />
          </button>
          <div class="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              class="avatar placeholder btn btn-circle btn-ghost indicator"
            >
              <span class="badge indicator-item badge-secondary"></span>
              <div class="w-10 rounded-full bg-accent text-accent-content">
                <span class="text-2xl">D</span>
              </div>
            </div>
            <ul
              tabIndex={0}
              class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <a href="/" class="justify-between">
                  Profile
                  <span class="badge">New</span>
                </a>
              </li>
              <li>
                <a href="/">Settings</a>
              </li>
              <li>
                <a href="/">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
});

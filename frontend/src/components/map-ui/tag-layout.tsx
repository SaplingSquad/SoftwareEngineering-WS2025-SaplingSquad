import { $, type Signal } from "@builder.io/qwik";

/**
 * A helper that takes care of layouting as many tags as can fit in a given space. Assumes that at least one tag fits.
 * @param tagContainerRef A reference to the container where the tags should be shown.
 * @param tagList The list of tags to be layouted.
 * @returns A QRL that should be attached to the documents `DOMContentLoaded` event to trigger layouting once the DOM is stable.
 */
export const layoutTags = function (
  tagContainerRef: Signal<HTMLDivElement>,
  tagList: string[],
) {
  return $(() => {
    const elem = tagContainerRef.value!;
    const classes =
      "rounded-full border border-primary bg-primary-content px-2 text-primary group-hover:brightness-90".split(
        " ",
      );

    let idx = 0;
    const added: HTMLDivElement[] = [];
    do {
      const tagElement = document.createElement("div");
      tagElement.classList.add(...classes);
      tagElement.textContent = tagList[idx++];
      elem.appendChild(tagElement);
      added.push(tagElement);
    } while (idx < tagList.length && elem.scrollWidth <= elem.offsetWidth);

    if (elem.scrollWidth > elem.offsetWidth) {
      elem.removeChild(added.pop()!);
      idx--;
    }
    if (idx < tagList.length) {
      const otherTagsElement = document.createElement("div");
      otherTagsElement.classList.add(...classes);
      otherTagsElement.textContent = "+" + (tagList.length - idx);
      elem.appendChild(otherTagsElement);

      if (elem.scrollWidth > elem.offsetWidth) {
        elem.removeChild(added.pop()!);
        otherTagsElement.textContent = "+" + (tagList.length - idx + 1);
      }
    }
  });
};

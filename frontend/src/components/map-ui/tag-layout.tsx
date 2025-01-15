import type { Signal } from "@builder.io/qwik";

function appendNewDivWithTextContent(container: HTMLDivElement, text: string) {
  const tagElement = document.createElement("div");
  tagElement.classList.add(
    ..."rounded-full border border-primary bg-primary-content px-2 text-primary".split(
      " ",
    ),
  );
  tagElement.textContent = text;
  container.appendChild(tagElement);
  return tagElement;
}

/**
 * A helper that takes care of layouting as many tags as can fit in a given space. Assumes that at least one tag fits.
 * @param tagContainerRef A reference to the container where the tags should be shown.
 * @param tagList The list of tags to be layouted.
 */
export const layoutTags = function (
  tagContainerRef: Signal<HTMLDivElement>,
  tagList: string[],
) {
  // Prefer shorter tag names, but we don't want to always show the same ones so do not sort by length
  const short: string[] = [];
  const long: string[] = [];
  tagList.forEach((tag) => (tag.length < 20 ? short : long).push(tag));
  tagList = short.concat(long);

  const elem = tagContainerRef.value!;

  const otherTagsElement = appendNewDivWithTextContent(
    elem,
    "+" + tagList.length,
  );

  let idx = 0;
  let tagElement: HTMLDivElement;
  do {
    tagElement = appendNewDivWithTextContent(elem, tagList[idx++]);
  } while (idx < tagList.length && elem.scrollWidth <= elem.offsetWidth);

  if (elem.scrollWidth > elem.offsetWidth) {
    elem.removeChild(tagElement);
    idx--;
  }

  if (idx === 0) {
    const truncatedTag = tagList[0];
    for (let len = truncatedTag.length - 5; len > 0; len -= 5) {
      const truncated = appendNewDivWithTextContent(
        elem,
        truncatedTag.substring(0, len).trimEnd() + "...",
      );

      if (elem.scrollWidth <= elem.offsetWidth) {
        break;
      }
      elem.removeChild(truncated);
    }
    idx++;
  }

  elem.removeChild(otherTagsElement);
  if (idx < tagList.length) {
    appendNewDivWithTextContent(elem, "+" + (tagList.length - idx));
  }
};

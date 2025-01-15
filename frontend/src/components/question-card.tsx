import { component$, useSignal } from "@builder.io/qwik";

/**
 * This type specifies the format in which the question is passed to the component.
 */
export type QuestionCardProps = {
  imageUrl: string | undefined;
  title: string | undefined;
  text: string | undefined;
  isSelected: boolean | undefined;
};

/**
 * Component displaying a single question as a card.
 */
export const QuestionCard = component$((props: { data: QuestionCardProps }) => {
  const cardHovered = useSignal<boolean>(false);

  return (
    <>
      <div
        class={[
          "relative mx-2 mb-20 w-96 overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.1] active:scale-[1.05]",
          props.data.isSelected ? "scale-[1.05]" : "scale-[0.90] grayscale",
        ]}
        onClick$={() => (props.data.isSelected = !props.data.isSelected)}
        onMouseEnter$={() => (cardHovered.value = true)}
        onMouseLeave$={() => (cardHovered.value = false)}
      >
        <figure>
          <img src={props.data.imageUrl} width="500" height="500" alt="" />
        </figure>

        <div class="absolute left-0 top-0 h-full w-full overflow-hidden">
          <div
            class={[
              "absolute left-0 top-0 h-full w-full bg-gradient-to-t from-primary via-transparent",
              cardHovered.value ? "from-40% via-80%" : "from-10% via-40%",
            ]}
          />
          <h1
            class={[
              "absolute left-4 text-3xl font-semibold text-primary-content transition-all",
              cardHovered.value ? "bottom-32" : "bottom-4",
            ]}
          >
            {props.data.title}
          </h1>
          <div
            class={[
              "absolute left-4 w-11/12 text-primary-content transition-all",
              cardHovered.value ? "top-72" : "top-96",
            ]}
          >
            <p>Möchtest du ...</p>
            <p>{props.data.text}</p>
          </div>
        </div>

        <div class="absolute right-4 top-4 h-24 w-24">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke-width="1.3"
            class={[
              "fill-primary-content stroke-primary transition-all duration-100 ease-in-out",
              props.data.isSelected ? "" : "opacity-0",
            ]}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75 11.25 15 9 12.75 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>

        <div
          class={[
            "absolute left-0 top-0 h-full w-full rounded-xl",
            props.data.isSelected ? "border-4 border-primary" : "",
          ]}
        />
      </div>
    </>
  );
});

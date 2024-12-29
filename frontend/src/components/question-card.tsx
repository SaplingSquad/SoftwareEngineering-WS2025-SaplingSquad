import { component$, useSignal } from "@builder.io/qwik";

/**
 * This type specifies the format in which the question is passed to the component.
 */
export type QuestionCardProps = {
  img: string;
  title: string;
  text: string;
  answer: "neu" | "pos";
};

type AnswerStyle = {
  card: string;
  border: string;
  check: string;
};

const answerStyles = new Map<string, AnswerStyle>([
  [
    "pos",
    {
      card: "scale-[1.05]",
      border: "border-4 border-primary",
      check: "",
    },
  ],
  [
    "neu",
    {
      card: "grayscale scale-[0.90]",
      border: "",
      check: "opacity-0",
    },
  ],
]);

/**
 * Component displaying a single question as a card.
 */
export const QuestionCard = component$((props: { data: QuestionCardProps }) => {
  const headerRef = useSignal<HTMLElement>();
  const textRef = useSignal<HTMLElement>();
  const gradientRef = useSignal<HTMLElement>();

  return (
    <>
      <div
        class={
          "relative mx-2 mb-20 w-96 overflow-hidden rounded-xl shadow-xl transition-all hover:scale-[1.1] active:scale-[1.05] " +
          answerStyles.get(props.data.answer)!.card
        }
        onClick$={() =>
          (props.data.answer = props.data.answer == "neu" ? "pos" : "neu")
        }
        onMouseEnter$={() => {
          headerRef.value!.classList.replace("bottom-4", "bottom-32");
          textRef.value!.classList.replace("top-96", "top-72");
          gradientRef.value!.classList.replace("from-10%", "from-40%");
          gradientRef.value!.classList.replace("via-40%", "via-80%");
        }}
        onMouseLeave$={() => {
          headerRef.value!.classList.replace("bottom-32", "bottom-4");
          textRef.value!.classList.replace("top-72", "top-96");
          gradientRef.value!.classList.replace("from-40%", "from-10%");
          gradientRef.value!.classList.replace("via-80%", "via-40%");
        }}
      >
        <figure>
          <img src={props.data.img} width="500" height="500" alt="" />
        </figure>

        <div class="absolute left-0 top-0 h-full w-full overflow-hidden">
          <div
            ref={gradientRef}
            class="absolute left-0 top-0 h-full w-full bg-gradient-to-t from-primary from-10% via-transparent via-40%"
          />
          <h1
            ref={headerRef}
            class="absolute bottom-4 left-4 text-3xl font-semibold text-primary-content transition-all"
          >
            {props.data.title}
          </h1>
          <div
            ref={textRef}
            class="absolute left-4 top-96 w-11/12 text-primary-content transition-all"
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
            class={
              "fill-primary-content stroke-primary transition-all duration-100 ease-in-out " +
              answerStyles.get(props.data.answer)!.check
            }
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75 11.25 15 9 12.75 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>

        <div
          class={
            "absolute left-0 top-0 h-full w-full rounded-xl " +
            answerStyles.get(props.data.answer)!.border
          }
        />
      </div>
    </>
  );
});

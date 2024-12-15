import { component$, JSXNode, useSignal } from "@builder.io/qwik";
import { HiStarOutline, HiNoSymbolOutline } from "@qwikest/icons/heroicons";
import styles from "./question-card.module.css";

/**
 * This type specifies the format in which the question is passed to the component.
 */
export type QuestionCardProps = {
  img: string;
  title: string;
  text: string;
  answer: "neg" | "neu" | "pos";
};

type AnswerStyle = {
  card: string;
  star: string;
  no: string;
};

const answerStyles = new Map<string, AnswerStyle>([
  [
    "pos",
    {
      card: styles.card_highlight,
      star: "text-8xl text-black fill-yellow-500 " + styles.thin_stroke,
      no: "text-3xl",
    },
  ],
  [
    "neu",
    {
      card: "",
      star: "text-3xl text-yellow-500 stroke-2",
      no: "text-3xl text-red-800 stroke-2",
    },
  ],
  [
    "neg",
    {
      card: "grayscale",
      star: "text-3xl",
      no: "text-8xl text-red-800",
    },
  ],
]);

/**
 * Component displaying a single question as a card.
 */
export const QuestionCard = component$((props: { data: QuestionCardProps }) => {
  const starRef = useSignal<HTMLElement>();
  const noRef = useSignal<HTMLElement>();

  return (
    <>
      <div
        class={
          "relative rounded-xl overflow-hidden mx-2 mb-10 w-96 bg-base-300 shadow-xl " +
          answerStyles.get(props.data.answer)!.card
        }
        onClick$={() => (props.data.answer = "neu")}
      >
        <figure>
          <img src={props.data.img} width="500" height="500" alt="" />
          <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#1e293bee] from-10% via-transparent via-40%" />
        </figure>
        <div class="absolute top-0 left-0 w-full h-full columns-2">
          <div
            class="w-full h-full"
            onMouseOver$={() => (starRef.value!.style.fontSize = "80px")}
            onMouseLeave$={() => (starRef.value!.style.fontSize = "30px")}
          />
          <div
            class="w-full h-full"
            onMouseOver$={() => (noRef.value!.style.fontSize = "80px")}
            onMouseLeave$={() => (noRef.value!.style.fontSize = "30px")}
          />
        </div>
        
        <h1 class="absolute left-4 bottom-4 font-semibold text-3xl text-sky-200">{props.data.title}</h1>
        
        <HiStarOutline
          ref={starRef}
          class={
            "absolute left-4 top-4 cursor-pointer transition-all hover:text-gray-200 " +
            answerStyles.get(props.data.answer)!.star
          }
          onClick$={(e) => (
            e.stopPropagation(),
            (props.data.answer = props.data.answer === "pos" ? "neu" : "pos")
          )}
        />
        <HiNoSymbolOutline
          ref={noRef}
          class={
            "absolute right-4 top-4 cursor-pointer transition-all hover:text-gray-200 " +
            answerStyles.get(props.data.answer)!.no
          }
          onClick$={(e) => (
            e.stopPropagation(),
            (props.data.answer = props.data.answer === "neg" ? "neu" : "neg")
          )}
        />
      </div>
    </>
  );
});

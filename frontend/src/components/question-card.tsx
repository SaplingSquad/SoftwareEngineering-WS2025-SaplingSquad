import { component$ } from "@builder.io/qwik";
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
  return (
    <>
      <div
        class={
          "card mx-2 mb-10 w-96 bg-neutral " +
          answerStyles.get(props.data.answer)!.card
        }
        onClick$={() => (props.data.answer = "neu")}
      >
        <figure>
          <img src={props.data.img} width="500" height="500" alt="" />
        </figure>
        <div class="card-body">
          <h1 class="card-title text-3xl text-sky-600">{props.data.title}</h1>
          <p class="text-slate-400">Möchtest du ...</p>
          <p class="text-slate-400">{props.data.text}</p>
        </div>
        <HiStarOutline
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

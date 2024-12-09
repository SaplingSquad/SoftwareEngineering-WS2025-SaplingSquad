import "./question-card.css";

import { component$ } from "@builder.io/qwik";
import { HiStarOutline, HiNoSymbolOutline } from "@qwikest/icons/heroicons";

export type QuestionCardProps = {
  img: string;
  title: string;
  text: string;
  answer: string;
};

type AnswerStyle = {
  card: string;
  star: string;
  no: string;
};

const answerStyles = new Map<string, AnswerStyle>([
  [
    "+",
    {
      card: "custom-card-highlight",
      star: "text-8xl text-black custom-thin-stroke fill-yellow-500",
      no: "text-3xl",
    },
  ],
  [
    "~",
    {
      card: "",
      star: "text-3xl text-yellow-500 stroke-2",
      no: "text-3xl text-red-800 stroke-2",
    },
  ],
  [
    "-",
    {
      card: "grayscale",
      star: "text-3xl",
      no: "text-8xl text-red-800",
    },
  ],
]);

export const QuestionCard = component$((props: { data: QuestionCardProps }) => {
  return (
    <>
      <div
        class={
          "card w-96 bg-neutral " + answerStyles.get(props.data.answer)!.card
        }
        onClick$={() => (props.data.answer = "~")}
      >
        <figure>
          <img src={props.data.img} width="500" height="500" alt="" />
        </figure>
        <div class="card-body">
          <h1 class="card-title text-3xl text-sky-600">{props.data.title}</h1>
          <p>Möchtest du ...</p>
          <p>{props.data.text}</p>
        </div>
        <HiStarOutline
          class={
            "absolute left-4 top-4 transition-all hover:text-gray-200 " +
            answerStyles.get(props.data.answer)!.star
          }
          onClick$={(e) => (
            e.stopPropagation(),
            (props.data.answer = props.data.answer === "+" ? "~" : "+")
          )}
        />
        <HiNoSymbolOutline
          class={
            "absolute right-4 top-4 transition-all hover:text-gray-200 " +
            answerStyles.get(props.data.answer)!.no
          }
          onClick$={(e) => (
            e.stopPropagation(),
            (props.data.answer = props.data.answer === "-" ? "~" : "-")
          )}
        />
      </div>
    </>
  );
});

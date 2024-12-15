import { component$, useSignal } from "@builder.io/qwik";
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
      card: "scale-[1.05]",
      star: "text-8xl text-black fill-yellow-500 " + styles.thin_stroke,
      no: "text-3xl",
    },
  ],
  [
    "neu",
    {
      card: "grayscale-[80%] scale-[0.90]",
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
  const headerRef = useSignal<HTMLElement>();
  const textRef = useSignal<HTMLElement>();
  const gradientRef = useSignal<HTMLElement>();

  return (
    <>
      <div
        class={
          "relative rounded-xl overflow-hidden mx-2 mb-20 w-96 bg-base-300 shadow-xl transition-all hover:scale-[1.1] hover:filter-none " +
          answerStyles.get(props.data.answer)!.card
        }
        onClick$={() => (props.data.answer = props.data.answer == "neu" ? "pos" : "neu")}
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

        <div class="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div ref={gradientRef} class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#1e293bee] from-10% via-transparent via-40%" />
          <h1 ref={headerRef} class="absolute bottom-4 left-4 transition-all font-semibold text-3xl text-sky-200">{props.data.title}</h1>
          <div ref={textRef} class="absolute top-96 left-4 transition-all">
            <p>Möchtest du ...</p>
            <p>{props.data.text}</p>
          </div>
        </div>
      </div>
    </>
  );
});

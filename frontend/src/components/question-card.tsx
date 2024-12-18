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
};

const answerStyles = new Map<string, AnswerStyle>([
  [
    "pos",
    {
      card: "scale-[1.05]",
      border: "border-4 border-amber-400",
    },
  ],
  [
    "neu",
    {
      card: "grayscale scale-[0.90]",
      border: "",
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
          "relative rounded-xl overflow-hidden mx-2 mb-20 w-96 bg-base-300 shadow-xl transition-all hover:scale-[1.1] active:scale-[1.05] " +
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
          <div ref={gradientRef} class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#ffffffee] from-10% via-transparent via-40%" />
          <h1 ref={headerRef} class="absolute bottom-4 left-4 transition-all font-semibold text-3xl text-sky-800">{props.data.title}</h1>
          <div ref={textRef} class="absolute top-96 left-4 transition-all text-sky-700 w-11/12">
            <p>Möchtest du ...</p>
            <p>{props.data.text}</p>
          </div>
        </div>

        <div class={"absolute top-0 left-0 w-full h-full rounded-xl " + answerStyles.get(props.data.answer)!.border}/>

      </div>
    </>
  );
});

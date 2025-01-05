import {
  $,
  component$,
  useOnWindow,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { api } from "~/api/api_url";
import { QuestionCard } from "~/components/question-card";
import type { QuestionCardProps } from "~/components/question-card";

/**
 * Fetches the questions shown to the user to select preferences.
 */
export const useQuestions = routeLoader$(async () => {
  try {
    const resp = await fetch(api("/questions"));
    const json = await resp.json();
    return Array.isArray(json)
      ? json.map(
          (question: {
            questionId: number;
            questionText: string;
            questionImageUrl: string;
            tagId: number;
          }): QuestionCardProps => ({
            img: question.questionImageUrl,
            title: "Titel",
            text: question.questionText,
            isSelected: false,
          }),
        )
      : [];
  } catch (error) {
    return [];
  }
});

/**
 * Shows the main question window, displaying the questions in a grid.
 */
export default component$(() => {
  const questions = useStore<QuestionCardProps[]>(useQuestions().value);
  const buttonRef = useSignal<HTMLButtonElement>();
  const buttonWidth = useSignal<number | null>(null);

  const updateButtonWidth = $(() => {
    if (buttonRef.value) {
      buttonWidth.value = buttonRef.value.offsetWidth;
    }
  });

  useOnWindow("load", updateButtonWidth);
  useOnWindow("resize", updateButtonWidth);

  return (
    <>
      <div class="min-h-screen bg-base-100 py-10 pb-28">
        <h1 class="mb-2 text-center text-4xl font-bold">
          Worauf möchtest du deinen Fokus legen?
        </h1>
        <h2 class="mb-8 text-center text-xl font-bold">
          Klicke Themen die deinen Interessen entsprechen einfach an
        </h2>
        <div class="flex flex-wrap justify-around">
          {questions.length === 0 ? (
            <p class="text-xl font-bold text-error">
              Verbindung fehlgeschlagen, bitte lade die Seite neu!
            </p>
          ) : (
            questions.map((item, idx: number) => (
              <QuestionCard key={idx} data={item} />
            ))
          )}
        </div>
        <a
          ref={buttonRef}
          class="btn btn-lg fixed bottom-6 right-10 border border-4 border-primary bg-primary-content text-primary hover:scale-[1.02] hover:border-secondary hover:bg-base-100"
          href="/map"
          style={{
            width: buttonWidth.value ? buttonWidth.value + 1 + "px" : "auto",
          }}
        >
          {questions.every((cardData) => !cardData.isSelected)
            ? "Überspringen 🡒"
            : "Weiter 🡒"}
        </a>
      </div>
    </>
  );
});

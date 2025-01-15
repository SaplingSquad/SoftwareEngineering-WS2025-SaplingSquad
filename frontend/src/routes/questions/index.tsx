import {
  $,
  component$,
  Resource,
  useOnWindow,
  useSignal,
} from "@builder.io/qwik";
import { useGetQuestions } from "~/api/api_hooks.gen";
import { ApiResponse } from "~/components/api";
import { QuestionCard, QuestionCardProps } from "~/components/question-card";

type Question = {
  id: number | undefined;
  title: string | undefined;
  text: string | undefined;
  imageUrl: string | undefined;
};

/**
 * Shows the main question window, displaying the questions in a grid.
 */
export default component$(() => {
  const buttonRef = useSignal<HTMLButtonElement>();
  const buttonWidth = useSignal<number | null>(null);

  const request = useGetQuestions();
  const questionCardProps = useSignal<QuestionCardProps[]>([]);

  const updateButtonWidth = $(() => {
    if (buttonRef.value) {
      buttonWidth.value = buttonRef.value.offsetWidth;
    }
  });

  useOnWindow("load", updateButtonWidth);
  useOnWindow("resize", updateButtonWidth);

  return (
    <Resource
      value={request}
      onResolved={(response) => (
        <ApiResponse
          response={response}
          on200$={(data: Question[]) => {
            questionCardProps.value = data.map((q) => ({
              isSelected: false,
              ...q,
            }));

            return (
              <div class="min-h-screen bg-base-100 py-10 pb-28">
                <h1 class="mb-2 text-center text-4xl font-bold">
                  Worauf möchtest du deinen Fokus legen?
                </h1>
                <h2 class="mb-8 text-center text-xl font-bold">
                  Klicke Themen die deinen Interessen entsprechen einfach an
                </h2>
                <div class="flex flex-wrap justify-around">
                  {questionCardProps.value.map((item, idx: number) => (
                    <QuestionCard key={idx} data={item} />
                  ))}
                </div>
                <a
                  ref={buttonRef}
                  class="btn btn-lg fixed bottom-6 right-10 border border-4 border-primary bg-primary-content text-primary hover:scale-[1.02] hover:border-secondary hover:bg-base-100"
                  href="/map"
                  style={{
                    width: buttonWidth.value
                      ? buttonWidth.value + 1 + "px"
                      : "auto",
                  }}
                >
                  {questionCardProps.value.every((q) => !q.isSelected)
                    ? "Überspringen 🡒"
                    : "Weiter 🡒"}
                </a>
              </div>
            );
          }}
          defaultError$={(code) => <p>{code}</p>}
        />
      )}
      onRejected={() => (
        <p class="text-xl font-bold text-error">
          Verbindung fehlgeschlagen, bitte lade die Seite neu!
        </p>
      )}
    />
  );
});

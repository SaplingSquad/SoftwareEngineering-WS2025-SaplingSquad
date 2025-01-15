import {
  $,
  component$,
  useOnWindow,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { getQuestions } from "~/api/api_methods.gen";
import { ApiUnreachable } from "~/components/api";
import {
  type QuestionCardProps,
  QuestionCard,
} from "~/components/question-card";

enum State {
  LOADING,
  ERROR,
  SUCCESS,
}

/**
 * Shows the main question window, displaying the questions in a grid.
 */
export default component$(() => {
  const buttonRef = useSignal<HTMLButtonElement>();
  const buttonWidth = useSignal<number | null>(null);
  const state = useSignal<State>(State.LOADING);
  const questionCardStore = useStore<{ props: QuestionCardProps[] }>({
    props: [],
  });

  useTask$(async () => {
    await getQuestions().then(
      (r) => {
        if (r.status === 200) {
          questionCardStore.props = r.body.map((q) => ({
            isSelected: false,
            ...q,
          }));
          state.value = State.SUCCESS;
        } else {
          state.value = State.ERROR;
        }
      },
      () => (state.value = State.ERROR),
    );
  });

  const updateButtonWidth = $(() => {
    if (buttonRef.value) {
      buttonWidth.value = buttonRef.value.offsetWidth;
    }
  });

  useOnWindow("load", updateButtonWidth);
  useOnWindow("resize", updateButtonWidth);

  switch (state.value) {
    case State.LOADING:
      return (
        <div class="align-center flex h-screen w-screen items-center bg-base-100">
          <span class="loading loading-dots loading-xs text-primary"></span>
        </div>
      );
    case State.ERROR:
      return <ApiUnreachable error={Error("Questions fetch failed")} />;
    case State.SUCCESS:
      return (
        <div class="min-h-screen bg-base-100 py-10 pb-28">
          <h1 class="mb-2 text-center text-4xl font-bold">
            Worauf möchtest du deinen Fokus legen?
          </h1>
          <h2 class="mb-8 text-center text-xl font-bold">
            Klicke Themen die deinen Interessen entsprechen einfach an
          </h2>
          <div class="flex flex-wrap justify-around">
            {questionCardStore.props.map((item, idx: number) => (
              <QuestionCard key={idx} data={item} />
            ))}
          </div>
          <a
            ref={buttonRef}
            class="btn btn-lg fixed bottom-6 right-10 border border-4 border-primary bg-primary-content text-primary hover:scale-[1.02] hover:border-secondary hover:bg-base-100"
            href="/map"
            style={{
              width: buttonWidth.value ? buttonWidth.value + 1 + "px" : "auto",
            }}
          >
            {questionCardStore.props.every((q) => !q.isSelected)
              ? "Überspringen 🡒"
              : "Weiter 🡒"}
          </a>
        </div>
      );
  }
});

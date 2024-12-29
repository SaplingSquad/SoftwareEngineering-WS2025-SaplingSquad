import {
  $,
  component$,
  useOnWindow,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import { QuestionCard } from "~/components/question-card";
import type { QuestionCardProps } from "~/components/question-card";

const DEMO_IMAGE = "https://picsum.photos/300";

/**
 * Temporary data until the backend is ready.
 */
// prettier-ignore
const data: QuestionCardProps[] = [
  { img: DEMO_IMAGE + "?x=1", title: "Bildung für Kinder", text: "benachteiligte Kinder unterstützen und ihnen Zugang zu Bildung ermöglichen?", isSelected: false },
  { img: DEMO_IMAGE + "?x=2", title: "Artenschutz und Biodiversität", text: "dich für den Schutz gefährdeter Tierarten und den Erhalt der Biodiversität einsetzen?", isSelected: false },
  { img: DEMO_IMAGE + "?x=3", title: "Hungerbekämpfung", text: "dazu beitragen, den Welthunger zu bekämpfen und Menschen in Not mit Lebensmitteln zu versorgen?", isSelected: false },
  { img: DEMO_IMAGE + "?x=4", title: "Katastrophenhilfe", text: "Gemeinden in Katastrophengebieten mit Nothilfe und langfristiger Unterstützung beistehen?", isSelected: false },
  { img: DEMO_IMAGE + "?x=5", title: "Klimaschutz", text: "die Auswirkungen des Klimawandels mindern und nachhaltige Lösungen fördern?", isSelected: false },
  { img: DEMO_IMAGE + "?x=6", title: "Hilfe für Geflüchtete", text: "dich für die Integration und Unterstützung von Geflüchteten engagieren?", isSelected: false },
  { img: DEMO_IMAGE + "?x=7", title: "Obdachlosenhilfe", text: "Obdachlosen helfen, ein sicheres Zuhause und eine Perspektive zu finden?", isSelected: false },
  { img: DEMO_IMAGE + "?x=8", title: "Frauenrechte und Gleichstellung", text: "dich für die Rechte von Frauen und die weltweite Gleichstellung engagieren?", isSelected: false },
  { img: DEMO_IMAGE + "?x=9", title: "Zugang zu sauberem Wasser", text: "den Zugang zu sauberem Trinkwasser in unterversorgten Regionen verbessern?", isSelected: false },
  { img: DEMO_IMAGE + "?x=10", title: "Psychische Gesundheit", text: "dich für die Förderung der psychischen Gesundheit und die Entstigmatisierung psychischer Erkrankungen einsetzen?", isSelected: false },
  { img: DEMO_IMAGE + "?x=11", title: "Tierschutz und Nutztierhaltung", text: "dich für den Schutz von Nutztieren und bessere Bedingungen in der Tierhaltung starkmachen?", isSelected: false },
  { img: DEMO_IMAGE + "?x=12", title: "Waldschutz und Aufforstung", text: "Wälder erhalten, aufforsten und den Lebensraum für zahlreiche Arten bewahren?", isSelected: false },
  { img: DEMO_IMAGE + "?x=13", title: "Medizinische Versorgung", text: "den Zugang zu medizinischer Versorgung für Menschen in Krisengebieten ermöglichen?", isSelected: false },
  { img: DEMO_IMAGE + "?x=14", title: "Bildung für Mädchen und Frauen", text: "Bildungsprojekte für Mädchen und Frauen in Entwicklungsländern fördern?", isSelected: false },
  { img: DEMO_IMAGE + "?x=15", title: "Meeresschutz", text: "dich für den Schutz der Ozeane und die Rettung von Meereslebewesen engagieren?", isSelected: false },
  { img: DEMO_IMAGE + "?x=16", title: "Kampf gegen Diskriminierung", text: "gegen Rassismus und Diskriminierung kämpfen und Vielfalt stärken?", isSelected: false },
]

/**
 * Shows the main question window, displaying the questions in a grid.
 */
export default component$(() => {
  const store = useStore({ data });
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
          {store.data.map((item, idx: number) => (
            <QuestionCard key={idx} data={item} />
          ))}
        </div>
        <a
          ref={buttonRef}
          class="btn btn-lg fixed bottom-6 right-10 border border-4 border-primary bg-primary-content text-primary"
          href="/"
          style={{
            width: buttonWidth.value ? buttonWidth.value + 1 + "px" : "auto",
          }}
        >
          {store.data.every((cardData) => !cardData.isSelected)
            ? "Überspringen 🡒"
            : "Weiter 🡒"}
        </a>
      </div>
    </>
  );
});

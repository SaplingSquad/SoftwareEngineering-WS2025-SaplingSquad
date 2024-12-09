import { component$, useStore } from "@builder.io/qwik";
import { QuestionCard } from "~/components/question-card";
import type { QuestionCardProps } from "~/components/question-card";

const DEMO_IMAGE = "https://picsum.photos/300";

// prettier-ignore
const data: QuestionCardProps[] = [
  { img: DEMO_IMAGE, title: "Bildung für Kinder", text: "benachteiligte Kinder unterstützen und ihnen Zugang zu Bildung ermöglichen?", answer: "~" },
  { img: DEMO_IMAGE, title: "Artenschutz und Biodiversität", text: "dich für den Schutz gefährdeter Tierarten und den Erhalt der Biodiversität einsetzen?", answer: "~" },
  { img: DEMO_IMAGE, title: "Hungerbekämpfung", text: "dazu beitragen, den Welthunger zu bekämpfen und Menschen in Not mit Lebensmitteln zu versorgen?", answer: "~" },
  { img: DEMO_IMAGE, title: "Katastrophenhilfe", text: "Gemeinden in Katastrophengebieten mit Nothilfe und langfristiger Unterstützung beistehen?", answer: "~" },
  { img: DEMO_IMAGE, title: "Klimaschutz", text: "die Auswirkungen des Klimawandels mindern und nachhaltige Lösungen fördern?", answer: "~" },
  { img: DEMO_IMAGE, title: "Hilfe für Geflüchtete", text: "dich für die Integration und Unterstützung von Geflüchteten engagieren?", answer: "~" },
  { img: DEMO_IMAGE, title: "Obdachlosenhilfe", text: "Obdachlosen helfen, ein sicheres Zuhause und eine Perspektive zu finden?", answer: "~" },
  { img: DEMO_IMAGE, title: "Frauenrechte und Gleichstellung", text: "dich für die Rechte von Frauen und die weltweite Gleichstellung engagieren?", answer: "~" },
  { img: DEMO_IMAGE, title: "Zugang zu sauberem Wasser", text: "den Zugang zu sauberem Trinkwasser in unterversorgten Regionen verbessern?", answer: "~" },
  { img: DEMO_IMAGE, title: "Psychische Gesundheit", text: "dich für die Förderung der psychischen Gesundheit und die Entstigmatisierung psychischer Erkrankungen einsetzen?", answer: "~" },
  { img: DEMO_IMAGE, title: "Tierschutz und Nutztierhaltung", text: "dich für den Schutz von Nutztieren und bessere Bedingungen in der Tierhaltung starkmachen?", answer: "~" },
  { img: DEMO_IMAGE, title: "Waldschutz und Aufforstung", text: "Wälder erhalten, aufforsten und den Lebensraum für zahlreiche Arten bewahren?", answer: "~" },
  { img: DEMO_IMAGE, title: "Medizinische Versorgung", text: "den Zugang zu medizinischer Versorgung für Menschen in Krisengebieten ermöglichen?", answer: "~" },
  { img: DEMO_IMAGE, title: "Bildung für Mädchen und Frauen", text: "Bildungsprojekte für Mädchen und Frauen in Entwicklungsländern fördern?", answer: "~" },
  { img: DEMO_IMAGE, title: "Meeresschutz", text: "dich für den Schutz der Ozeane und die Rettung von Meereslebewesen engagieren?", answer: "~" },
  { img: DEMO_IMAGE, title: "Kampf gegen Diskriminierung", text: "gegen Rassismus und Diskriminierung kämpfen und Vielfalt stärken?", answer: "~" },
]

export default component$(() => {
  const store = useStore({ data });

  return (
    <>
      <div class="min-h-screen bg-base-100 py-10 pb-28">
        <h1 class="mb-8 text-center text-4xl font-bold">
          Worauf möchtest du deinen Fokus legen?
        </h1>
        <div class="grid grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-4">
          {store.data.map((item, idx: number) => (
            <QuestionCard key={idx} data={item} />
          ))}
        </div>
        <button class="btn btn-primary btn-lg fixed bottom-6 right-10 w-48">
          {store.data.every((cardData) => cardData.answer === "~")
            ? "Überspringen 🡒"
            : "Weiter 🡒"}
        </button>
      </div>
    </>
  );
});

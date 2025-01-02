import { component$, useStore, } from "@builder.io/qwik";
import { Profile } from "~/components/profile";
import type { ProfileProjectsProps } from "~/components/profile";

const DEMO_IMAGE = "https://picsum.photos/300";

const data: ProfileProjectsProps[] = [
    { img: DEMO_IMAGE, title: "Bildung für Kinder", text: "benachteiligte Kinder unterstützen und ihnen Zugang zu Bildung ermöglichen?" },
    { img: DEMO_IMAGE, title: "Artenschutz und Biodiversität", text: "dich für den Schutz gefährdeter Tierarten und den Erhalt der Biodiversität einsetzen?" },
    { img: DEMO_IMAGE, title: "Hungerbekämpfung", text: "dazu beitragen, den Welthunger zu bekämpfen und Menschen in Not mit Lebensmitteln zu versorgen?" },
    { img: DEMO_IMAGE, title: "Katastrophenhilfe", text: "Gemeinden in Katastrophengebieten mit Nothilfe und langfristiger Unterstützung beistehen?" },
]

export default component$(() => {
    const store = useStore(data);

    return (
        <>
            <Profile data={store} />
        </>
    )
})
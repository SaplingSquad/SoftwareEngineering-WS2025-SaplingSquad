import {
    $,
    component$,
    useOnWindow,
    useSignal,
    useStore,
} from "@builder.io/qwik";
import { Vereinsignup, Badge } from "~/components/profile/manage-organisation";

const data: Badge[] = [
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
]

export default component$(() => {
    const vereintag = useStore(data);
    return (
        <>
            <div class="h-3/6">
                <Vereinsignup data={vereintag} />
            </div>
        </>
    )
})
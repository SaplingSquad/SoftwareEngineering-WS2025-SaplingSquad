import { component$, useComputed$, useStore, } from "@builder.io/qwik";
import { UserProfile, VereinProfile } from "~/components/profile/profile";
import type { OrgaInformationsProps, ProfileProjectsProps } from "~/components/profile/profile";
import { useSession } from "../plugin@auth";
import { getAccountType, isAccTypeOrg, isAccTypeUser, useAccountType } from "~/auth/tools";
import { LoginOverviewParamsForm } from "~/components/auth/login";
import { routeLoader$ } from "@builder.io/qwik-city";
import { api } from "~/api/api_url";
import { InitialValues } from "@modular-forms/qwik";

const DEMO_IMAGE = "https://picsum.photos/300";

const projectdata: ProfileProjectsProps[] = [
    { img: DEMO_IMAGE, title: "Bildung für Kinder", text: "benachteiligte Kinder unterstützen und ihnen Zugang zu Bildung ermöglichen?" },
    { img: DEMO_IMAGE, title: "Artenschutz und Biodiversität", text: "dich für den Schutz gefährdeter Tierarten und den Erhalt der Biodiversität einsetzen?" },
    { img: DEMO_IMAGE, title: "Hungerbekämpfung", text: "dazu beitragen, den Welthunger zu bekämpfen und Menschen in Not mit Lebensmitteln zu versorgen?" },
    { img: DEMO_IMAGE, title: "Katastrophenhilfe", text: "Gemeinden in Katastrophengebieten mit Nothilfe und langfristiger Unterstützung beistehen?" },
]


export default component$(() => {
    const store = useStore(projectdata);

    const session = useSession();
    const accType = getAccountType(session.value)
    const useaccType = useAccountType(session)

    const ProfileAccountController = useComputed$(() => {
        const isAuthorized = session.value?.user?.email

        return (
            isAccTypeUser(useaccType) ?
                <>
                    <UserProfile profiledata={session} />
                </>
                : isAccTypeOrg(useaccType) ?
                    <>
                        <VereinProfile projectdata={store} profiledata={session} />
                    </>
                    :
                    <>
                        <div class="flex justify-center p-32">
                            <div class="card bg-base-100 w-96 shadow-xl">
                                <div class="card-body items-center text-center">
                                    <h2 class="card-title">Nicht eingeloggt.</h2>
                                    <div class="card-actions">
                                        <LoginOverviewParamsForm redirectTo={"/profile"}>
                                            <button class="btn btn-primary">Hier einloggen!</button>
                                        </LoginOverviewParamsForm>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
        )
    })
    return (
        <>
            <div>
                {ProfileAccountController}
            </div>
        </>
    )
})
import {component$} from "@builder.io/qwik";

const LogoutButton = () => {
    return (
        // /auth/signout is provided by auth.js library
        <form method={"POST"} action={`/auth/signout`}>
            <input type="hidden" name="crsfToken"/>
            <button class={"btn btn-block"}>Ausloggen</button>
        </form>
    );
}

/**
 * Custom sign in page
 */
export default component$(() => {
    return (
        <div class={"w-full flex flex-row justify-center min-h-dvh items-center bg-base-200"}>
            <div class={"max-w-lg w-full card shadow-xl bg-base-100"}>
                <div class={"card-body"}>
                    <h1 class={"text-2xl text-center mb-4"}>Ausloggen</h1>
                    <p>Sicher, dass du dich abmelden möchtest?</p>
                    <LogoutButton></LogoutButton>
                </div>
            </div>
        </div>
    );
});

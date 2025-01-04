import { component$, Slot } from "@builder.io/qwik";


export default component$(() => {
    return (
        <>
            <div class="drawer">
                <input id="my-drawer" type="checkbox" class="drawer-toggle" />
                <div class="drawer-content">
                    <div class="flex justify-center">
                        <div class="navbar bg-secondary navbar-rounded">
                            <div class="flex-none">
                                <label for="my-drawer" class="btn btn-primary btn-square btn-ghost drawer-button">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        class="inline-block h-5 w-5 stroke-current">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M4 6h16M4 12h16M4 18h16"></path>
                                    </svg>
                                </label>
                            </div>
                            <div class="flex-1">
                                <a class="btn btn-ghost text-xl" href="/">Sprout</a>
                            </div>
                            <div class="dropdown dropdown-end">
                                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                                    <div class="w-10 rounded-full">
                                        <img
                                            alt="Tailwind CSS Navbar component"
                                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                    </div>
                                </div>
                                <ul
                                    tabindex="0"
                                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                    <li>
                                        <a href="/profile">
                                            Profil
                                        </a>
                                    </li>
                                    <li><a>Settings</a></li>
                                    <li><a>Logout</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <Slot />{ }
                </div>
                <div class="drawer-side">
                    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
                    <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                        <li class="menu-title text-xl">Sprout</li>

                        <li><a href="/">Karte</a></li>
                        <li><a href="/questions">Fragen</a></li>
                    </ul>
                </div>
            </div>
        </>
    )
})
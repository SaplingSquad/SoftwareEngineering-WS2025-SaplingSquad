import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
    colors: {
      "base-400": "#445361",
      "base-400-content": "#f1f1f1",
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        sprout_light: {
          "primary": "#386641",
          "primary-content": "#ebf6ec",
          "secondary": "#6a994e",
          "secondary-content": "#040802",
          "accent": "#4497a9",
          "accent-content": "#141310",
          "neutral": "#445361",
          "neutral-content": "#eef2f5",
          "base-100": "#ffffff",
          "base-200": "#e5e7eb",
          "base-300": "#d1d5db",
          "base-content": "#161616",
          "info": "#023e8a",
          "info-content": "#cbd7e9",
          "success": "#a7c957",
          "success-content": "#0a0f03",
          "warning": "#d99341",
          "warning-content": "#110801",
          "error": "#8d3335",
          "error-content": "#f2dcd9",
        },
      },
    ],
  },
};

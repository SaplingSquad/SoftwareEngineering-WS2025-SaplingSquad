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
          "accent": "#075985",
          "accent-content": "#f1f1f1",
          "neutral": "#f2e8cf",
          "neutral-content": "#141310",
          "base-100": "#ffffff",
          "base-200": "#dedede",
          "base-300": "#bebebe",
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

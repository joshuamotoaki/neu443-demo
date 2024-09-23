/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        "lexend": ["Lexend Variable", "sans-serif"],
      }
    },
  },
  plugins: [require('daisyui'),],
  daisyui: {
    themes: ["lofi"]
  }
}


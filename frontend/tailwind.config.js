/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#fafafa",
        primary: {
          DEFAULT: "#4f46e5",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#18181b",
          foreground: "#fafafa",
        },
        border: "#27272a",
        muted: {
          DEFAULT: "#27272a",
          foreground: "#a1a1aa",
        },
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          void: "#030308",
          dark: "#080812",
          surface: "#0f1021",
          accent: "#6366f1",
          glow: "#818cf8",
        },
      },
    },
  },
  plugins: [],
}


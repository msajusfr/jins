/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#151111",
        panel: "#211b1a",
        panelSoft: "#2d2421",
        cinnabar: "#8f1f1b",
        gold: "#caa45f",
        rice: "#f4ead7",
      },
      boxShadow: {
        warm: "0 24px 80px rgba(0, 0, 0, 0.32)",
      },
    },
  },
  plugins: [],
};

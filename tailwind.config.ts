import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        grape: { 50: "#F4F0FF", 100: "#E7DEFF", 200: "#CDBDFF", 400: "#8E6CFF", 500: "#7650F5", 600: "#5F3CE0", 700: "#4A2DB8", 900: "#2A1A6B" },
        sky: { 50: "#EEF5FF", 100: "#DCEAFF", 400: "#5B9BFF", 500: "#3B82F6" },
        sun: { 100: "#FFF2C2", 300: "#FFD84D", 400: "#FFC62E", 500: "#F5A800" },
        rosa: { 50: "#FFF0F6", 100: "#FFDCEB", 400: "#FF7EB6", 500: "#F5539B" },
        ink: { 900: "#241A4F", 700: "#4B4175", 500: "#776E9F", 300: "#B7B0D3" },
      },
      fontFamily: {
        display: ["Fredoka", "ui-rounded", "Nunito", "system-ui", "sans-serif"],
        sans: ["Nunito", "ui-rounded", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 0 rgba(95,60,224,0.06), 0 12px 28px -12px rgba(95,60,224,0.25)",
        pop: "0 4px 0 rgba(36,26,79,0.12)",
      },
      keyframes: {
        bob: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-4px)" } },
      },
      animation: { bob: "bob 2.4s ease-in-out infinite" },
    },
  },
  plugins: [],
};
export default config;

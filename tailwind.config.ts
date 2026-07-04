import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          bg: "#0B0F14",
          panel: "#111826",
          accent: "#4F7CFF",
        },
      },
    },
  },
  plugins: [],
};

export default config;

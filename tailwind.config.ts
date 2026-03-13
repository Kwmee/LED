import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0b1320",
        accent: "#ef7d00",
        surface: "#101b2d",
        stroke: "#203047"
      }
    }
  },
  plugins: []
};

export default config;

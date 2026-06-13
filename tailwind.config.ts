import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#7489FF",
          hover: "#3B5BEB",
          foreground: "#FFFFFF",
        },
        navy: "#384EC7",
        surface: "#F7FBFF",
        border: "#9CA3AF",
      },
      borderRadius: {
        DEFAULT: "8px",
      },
    },
  },
  plugins: [],
} satisfies Config;

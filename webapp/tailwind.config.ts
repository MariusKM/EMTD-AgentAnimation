import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0f1115",
        panel: "#171b22",
        panel2: "#1f242d",
        border: "#2a313c",
        text: "#e6e9ef",
        muted: "#8a93a3",
        accent: "#f5b14a",
        good: "#5fc97a",
        bad: "#e26060",
      },
    },
  },
  plugins: [],
} satisfies Config;

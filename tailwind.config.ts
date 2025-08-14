import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
  },
  darkMode: "class",
  plugins: [
    require('@tailwindcss/typography'),
    heroui({
      themes: {
        light: {
          colors: {
            warning: {
              foreground: "#f2f1ef",
            },
            danger: {
              foreground: "#f2f1ef",
            },
            success: {
              foreground: "#f2f1ef",
            },
          }
        }
      }
    })
  ],
} satisfies Config;

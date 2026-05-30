import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans KR", "sans-serif"],
      },
      fontSize: {
        "display-sm": ["3rem", { lineHeight: "1.2" }],
        "display-md": ["5rem", { lineHeight: "1.15" }],
        "display-lg": ["7rem", { lineHeight: "1.1" }],
        "display-xl": ["8rem", { lineHeight: "1.1" }],
      },
      colors: {
        lyric: {
          bg: "#000000",
          primary: "#FFFFFF",
          secondary: "#9CA3AF",
          section: "#6B7280",
          title: "#D1D5DB",
        },
      },
    },
  },
  plugins: [],
};

export default config;

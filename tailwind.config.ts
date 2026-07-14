import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0B0C0E",
        sand: "#F2EFE9",
        rust: {
          DEFAULT: "#C36A3F",
          dark: "#A4512C",
        },
        sage: "#7A8471",
        silver: "#E2E8F0",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        subtitle: ["var(--font-manrope)"],
        mono: ["var(--font-space-mono)"],
      },
      backgroundSize: {
        "gradient-sweep": "200% auto",
      },
      keyframes: {
        "gradient-sweep": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        "gradient-sweep": "gradient-sweep 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#0A0A0A",
          deep: "#0D0D0D",
        },
        sand: "#F2EFE9",
        rust: {
          DEFAULT: "#C9793C",
          light: "#D98A4A",
          dark: "#A4512C",
        },
        sage: "#7A8471",
        silver: "#E2E8F0",
        // Light-section palette (contact): warm paper base, dark primary
        // derived from it, and the soft copper accent pair.
        linen: "#EFEBE3",
        espresso: "#2B2420",
        copper: {
          light: "#E8C2A0",
          DEFAULT: "#D4986E",
        },
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

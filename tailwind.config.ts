import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // All values resolve from the CSS custom properties declared in
      // src/shared/styles/globals.css — the palette's single source of truth.
      colors: {
        obsidian: {
          DEFAULT: "rgb(var(--color-obsidian) / <alpha-value>)",
          deep: "rgb(var(--color-obsidian-deep) / <alpha-value>)",
        },
        sand: "rgb(var(--color-sand) / <alpha-value>)",
        rust: {
          DEFAULT: "rgb(var(--color-rust) / <alpha-value>)",
          light: "rgb(var(--color-rust-light) / <alpha-value>)",
          dark: "rgb(var(--color-rust-dark) / <alpha-value>)",
        },
        sage: "rgb(var(--color-sage) / <alpha-value>)",
        silver: "rgb(var(--color-silver) / <alpha-value>)",
        // Light-section palette (contact/footer): warm paper base, dark
        // primary derived from it, and the soft copper accent pair.
        linen: "rgb(var(--color-linen) / <alpha-value>)",
        espresso: "rgb(var(--color-espresso) / <alpha-value>)",
        copper: {
          light: "rgb(var(--color-copper-light) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-copper) / <alpha-value>)",
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

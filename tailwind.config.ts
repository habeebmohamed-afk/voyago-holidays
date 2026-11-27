import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#132352",
          light: "#1E3573",
          dark: "#0C1738",
        },
        teal: {
          brand: "#1B8A8F",
          light: "#E6F4F5",
        },
        coral: {
          DEFAULT: "#F26B4E",
          hover: "#DC5538",
          light: "#FFF0EC",
        },
        amber: {
          warm: "#F79256",
        },
        surface: {
          DEFAULT: "#F8F7F4",
          card: "#FFFFFF",
        },
      },
      fontFamily: {
        heading: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

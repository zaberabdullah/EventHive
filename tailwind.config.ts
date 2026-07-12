import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        stage: {
          DEFAULT: "#241B3A",
          light: "#382A57",
          dark: "#160F26",
        },
        spotlight: {
          DEFAULT: "#F5A623",
          light: "#FFC15C",
          dark: "#D98C0F",
        },
        ember: {
          DEFAULT: "#FF6B6B",
          light: "#FF9494",
          dark: "#E14F4F",
        },
        paper: "#FAF9F7",
        ink: "#1C1B1F",
        mist: "#6B6673",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        card: "14px",
      },
      backgroundImage: {
        "stage-radial":
          "radial-gradient(circle at 20% 20%, #382A57 0%, #241B3A 45%, #160F26 100%)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        pulseSoft: "pulseSoft 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

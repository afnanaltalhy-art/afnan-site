import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: { DEFAULT: "#FAF7F0", 50: "#FDFCF8", 100: "#FAF7F0", 200: "#F2ECDF", 300: "#E7DDC8" },
        navy: { DEFAULT: "#0F1E3A", 950: "#070F21", 900: "#0B1730", 800: "#0F1E3A", 700: "#18294A", 600: "#24375C", 500: "#3A4D73", 300: "#8D9AB5" },
        gold: { DEFAULT: "#B8975A", 50: "#FBF6EC", 100: "#F3E8D0", 200: "#E6D2A8", 300: "#D4B87F", 400: "#C6A66A", 500: "#B8975A", 600: "#9C7C43", 700: "#7A6034" },
      },
      fontFamily: { sans: ["var(--font-almarai)", "system-ui", "sans-serif"] },
      boxShadow: {
        lux: "0 1px 0 rgba(255,255,255,.6) inset, 0 20px 50px -24px rgba(15,30,58,.35)",
        glow: "0 0 0 1px rgba(184,151,90,.25), 0 18px 40px -18px rgba(184,151,90,.45)",
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
      },
      animation: { shimmer: "shimmer 6s linear infinite" },
    },
  },
  plugins: [],
} satisfies Config;

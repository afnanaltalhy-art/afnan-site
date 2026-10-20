import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "rgb(var(--brand) / <alpha-value>)", deep: "rgb(var(--brand-deep) / <alpha-value>)" },
        accent: { DEFAULT: "rgb(var(--accent) / <alpha-value>)", warm: "rgb(var(--accent-warm) / <alpha-value>)" },
        ink: { DEFAULT: "#06201E", 900: "#041816", 800: "#0A2E2B", 700: "#0F3B37" },
        cream: "#FFF9EF",
        violet: { DEFAULT: "#6D4FC2", soft: "#BDB0FF" },
        rose: { DEFAULT: "#E8618C" },
        sky: { DEFAULT: "#2E78C7" },
        navy: "#1D2B36",
      },
      fontFamily: { sans: ["var(--font-almarai)", "system-ui", "sans-serif"] },
      boxShadow: { glow: "0 0 0 1px rgba(255,255,255,.06), 0 20px 60px -20px rgba(0,0,0,.6)", card: "0 18px 40px -18px rgba(0,0,0,.45)" },
      keyframes: {
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      animation: { floaty: "floaty 6s ease-in-out infinite", shimmer: "shimmer 3s linear infinite" },
    },
  },
  plugins: [],
};
export default config;

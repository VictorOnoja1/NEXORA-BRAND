/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // NEXORA 2.0 — "premium, feminine, warm, Nigerian" identity (client
        // brief: 70% warm white / 20% soft lilac / 7% deep lilac / 3% blush
        // pink). Token *names* are kept identical to v1/v2 on purpose so
        // every existing bg-plum / text-chocolate / bg-champagne / etc.
        // class repaints automatically — no component rewrites required to
        // pick up the new identity.
        plum: {
          // role: primary brand / CTA. Re-tinted from purple to pink (Sept
          // 2026: "i dont want it purple make it pink"), then re-tuned to
          // this softer, dustier rose after the client sent the LUMINA
          // reference photo — every value here is sampled straight from
          // that photo (bottle cap / wordmark ink), not just "a pink".
          // Token name kept as "plum" on purpose so every existing
          // bg-plum / text-plum / border-plum class repaints automatically.
          DEFAULT: "#8E535A",
          50: "#F8F4F4",
          100: "#F0E5E7",
          200: "#E1CBCE",
          300: "#CEABB0",
          400: "#B8848B",
          500: "#A5646C",
          600: "#8E535A",
          700: "#6E4046",
          800: "#4D2D31",
          900: "#301C1F",
        },
        chocolate: {
          // role: ink. DEFAULT = primary text, muted = secondary/meta text.
          DEFAULT: "#2B252A",
          light: "#3B3238",
          muted: "#6F646C",
        },
        rose: {
          // role: secondary warm accent (ratings, sale tags, small highlights)
          DEFAULT: "#C98CA0",
          light: "#E3B3C2",
          dark: "#A5657C",
        },
        blush: "#E8C5D0", // role: sparing accent — the "3% blush pink"
        champagne: {
          // role: section backgrounds / soft highlight — the "20% soft lilac"
          DEFAULT: "#E6DDF2",
          light: "#F1ECF9",
          dark: "#D4C4E8",
        },
        ivory: {
          // role: main background — the "70% warm white". Must dominate.
          DEFAULT: "#FAF8F5",
          dark: "#F2ECE3",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 12px rgba(43, 37, 42, 0.05)",
        card: "0 4px 20px rgba(43, 37, 42, 0.07)",
        elevated: "0 8px 32px rgba(142, 83, 90, 0.12)",
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "14px",
        xl: "20px",
      },
      letterSpacing: {
        widest2: "0.18em",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out both",
      },
      maxWidth: {
        "8xl": "1440px",
      },
    },
  },
  plugins: [],
};

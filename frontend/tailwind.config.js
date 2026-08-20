/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../shared/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          DEFAULT: "#4A2634",
          50: "#F5EDF0",
          100: "#E9D5DC",
          200: "#D3ABB9",
          300: "#BC8296",
          400: "#A65873",
          500: "#8F3F58",
          600: "#6E2F42",
          700: "#4A2634",
          800: "#341A24",
          900: "#1E0F15",
        },
        chocolate: {
          DEFAULT: "#24191A",
          light: "#3A2A2C",
        },
        rose: {
          DEFAULT: "#D9A8B1",
          light: "#E6C4CA",
          dark: "#C68793",
        },
        blush: "#FADADD",
        champagne: {
          DEFAULT: "#E7C6A8",
          light: "#F1DDC7",
          dark: "#D8AE83",
        },
        ivory: {
          DEFAULT: "#FFF7F3",
          dark: "#FBEEE7",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 12px rgba(36, 25, 26, 0.06)",
        card: "0 4px 20px rgba(36, 25, 26, 0.08)",
        elevated: "0 8px 32px rgba(74, 38, 52, 0.14)",
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

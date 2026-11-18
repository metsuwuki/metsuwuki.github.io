import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Segoe UI Variable"', '"Segoe UI"', "sans-serif"],
        display: ['"Cormorant Garamond"', '"Cinzel"', "serif"],
        ornament: ['"MadeCarving"', '"Cormorant Garamond"', "serif"]
      },
      colors: {
        bg: "#07101f",
        surface: "#101d36",
        text: "#f4efe3",
        muted: "#bac8e2",
        teal: "#8fe7ea",
        violet: "#a58bff",
        gold: "#e7c77f",
        rose: "#f29ec7"
      }
    }
  },
  plugins: []
} satisfies Config;

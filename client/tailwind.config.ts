import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gl: {
          /* Core brand */
          nightbloom: "#3C1828",
          plum: "#7A3548",
          wildrose: "#A85068",
          dustypetal: "#CC8898",
          blush: "#E0AABA",
          softbloom: "#ECC8D0",
          petalmist: "#F5E8E4",
          parchment: "#F0E4D0",
          /* Button accents */
          moss: "#8A9860",
          pollen: "#C8A844",
          lavender: "#B8A8C4",
          danger: "#C85840",
          /* Extended */
          ink: "#3C1828",
          stone: "#8A6570",
          pebble: "#DCC0C8",
          white: "#FFFFFF",
          "danger-light": "#FAEDEA",
          "danger-mid": "#E4A090",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["48px", { lineHeight: "1.1", fontWeight: "300" }],
        "display-lg": ["32px", { lineHeight: "1.2", fontWeight: "400" }],
        "display-md": ["22px", { lineHeight: "1.3", fontWeight: "400" }],
        "display-sm": ["18px", { lineHeight: "1.3", fontWeight: "400" }],
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "10px",
        xl: "14px",
        pill: "20px",
      },
    },
  },
  plugins: [],
};

export default config;

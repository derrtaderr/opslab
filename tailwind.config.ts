import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        dark: {
          DEFAULT: '#1A1B1E',
          'surface': '#25262B',
          'hover': '#2C2E33',
          'border': '#373A40',
          'text': '#C1C2C5',
          'accent': '#1971C2',
        },
        // Light theme colors (for future use)
        light: {
          DEFAULT: '#FFFFFF',
          'surface': '#F8F9FA',
          'hover': '#F1F3F5',
          'border': '#DDE0E4',
          'text': '#1A1B1E',
          'accent': '#228BE6',
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config; 
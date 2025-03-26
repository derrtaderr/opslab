import type { Config } from "tailwindcss";

// Debug print of config
console.log("Loading Tailwind config");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Debug - confirm dark mode is class-based
  theme: {
    extend: {
      colors: {
        dark: "var(--dark)",
        "dark-surface": "var(--dark-surface)",
        "dark-surface-dark": "var(--dark-surface-dark)",
        "dark-border": "var(--dark-border)",
        "text-secondary": "var(--text-secondary)",
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        error: "var(--error)",
        secondary: "#ff9190",
        text: {
          DEFAULT: "#f0f4fc",
          secondary: "#a0aec0",
        },
        success: "#10b981",
        warning: "#f59e0b",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        lg: "var(--shadow-lg)",
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
};

// Debug print entire config
console.log("Tailwind darkMode setting:", config.darkMode);

export default config; 
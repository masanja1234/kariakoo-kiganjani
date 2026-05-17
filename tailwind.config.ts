import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        brand: {
          green: "#1a7c3e",
          yellow: "#f5a623",
          dark: "#0f2d1a",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
  safelist: [
    // About page team avatars
    "bg-primary-600",
    "bg-purple-600",
    "bg-blue-600",
    // Admin dashboard stat card icon backgrounds (light)
    "bg-green-100", "bg-primary-100", "bg-blue-100", "bg-orange-100",
    "bg-purple-100", "bg-yellow-100", "bg-indigo-100", "bg-teal-100",
    "bg-pink-100", "bg-red-100",
    // Admin dashboard stat card icon backgrounds (dark)
    "dark:bg-green-950/30", "dark:bg-primary-950/30", "dark:bg-blue-950/30",
    "dark:bg-orange-950/30", "dark:bg-purple-950/30", "dark:bg-yellow-950/30",
    "dark:bg-indigo-950/30", "dark:bg-teal-950/30", "dark:bg-pink-950/30",
    "dark:bg-red-950/30",
    // Admin dashboard stat card icon text colors
    "text-green-600", "text-primary-600", "text-blue-600", "text-orange-600",
    "text-purple-600", "text-yellow-600", "text-indigo-600", "text-teal-600",
    "text-pink-600", "text-red-600",
  ],
};

export default config;

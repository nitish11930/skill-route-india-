/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-tint": "#2f6fed",
        "on-surface": "#1e2238",
        "surface": "#ffffff",
        "surface-subtle": "#f8f9fd",
        "canvas": "#f4f5fb",
        "primary": "#2f6fed",
        "primary-hover": "#2458c7",
        "primary-container": "#2f6fed",
        "primary-light": "#edf3ff",
        "secondary": "#7c5cfc",
        "secondary-light": "#f2efff",
        "success-soft": "#eafaf1",
        "success-text": "#16a34a",
        "amber-soft": "#fff7ed",
        "amber-text": "#ea580c",
        "coral-soft": "#fff1ee",
        "coral-text": "#f04438",
        "outline-soft": "#e6e8f2",
        "outline-variant": "#dbe0ee",
        "on-surface-variant": "#626784",
        "tertiary": "#8b90a7",
        "background": "#fbf8ff",
      },
      borderRadius: {
        "xl": "0.875rem",
        "2xl": "1rem",
        "3xl": "1.25rem",
        "full": "9999px"
      },
      boxShadow: {
        "card": "0 4px 20px -2px rgba(112, 116, 150, 0.07), 0 1px 4px 0 rgba(112, 116, 150, 0.04)",
        "card-hover": "0 12px 28px -4px rgba(99, 102, 241, 0.12), 0 2px 6px 0 rgba(112, 116, 150, 0.06)",
        "pill": "0 2px 8px rgba(47, 111, 237, 0.2)",
        "pill-primary": "0 4px 14px rgba(47, 111, 237, 0.35)",
        "clickup": "0 4px 20px -2px rgba(90, 80, 140, 0.06), 0 1px 3px 0 rgba(90, 80, 140, 0.04)",
        "clickup-hover": "0 12px 28px -4px rgba(90, 80, 140, 0.12), 0 4px 8px -2px rgba(90, 80, 140, 0.04)"
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Inter'", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      }
    },
  },
  plugins: [],
}

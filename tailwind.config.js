/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        xctrack: {
          dark: '#12151a',
          card: '#1a1f29',
          border: '#2a3242',
          accent: '#0284c7',
          highlight: '#38bdf8',
        }
      },
      fontFamily: {
        xctrack: ['XCTrackSans', 'sans-serif'],
        condensed: ['XCTrackCondensed', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

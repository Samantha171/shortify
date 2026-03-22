/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shortify: {
          bg: '#0B1220',
          card: 'rgba(255,255,255,0.05)',
          border: 'rgba(255,255,255,0.08)',
          btn: '#4988C4',
        }
      }
    },
  },
  plugins: [],
}

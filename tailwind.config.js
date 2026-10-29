/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF7F2',
        linen: '#F2ECE1',
        sanctuary: '#1A1715',
        espresso: '#2C2825',
        taupe: '#6E665E',
        champagne: '#8C6D46',
        sage: '#5C6458',
        divider: '#E5DEC9',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

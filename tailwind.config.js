/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0c0d0e',
        surface: '#141618',
        'surface-elevated': '#1c1f23',
        'surface-border': '#282c34',
        accent: {
          amber: '#f59e0b',
          gold: '#d97706',
          cyan: '#06b6d4',
          emerald: '#10b981',
          rose: '#f43f5e',
          violet: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Newsreader', 'Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
};

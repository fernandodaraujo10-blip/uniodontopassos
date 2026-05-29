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
        brand: {
          primary: '#D81B60',
          secondary: '#E91E63',
          dark: '#2D0A1B',
          bg: '#F8F9FA'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // Breakpoints padrão do Tailwind já cobrem mobile-first:
      // sm: 640px | md: 768px | lg: 1024px | xl: 1280px | 2xl: 1536px
      screens: {
        'xs': '375px', // iPhones menores / Android compacto
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
      },
      minHeight: {
        'touch': '44px', // Área mínima de toque recomendada
      },
    },
  },
  plugins: [],
}

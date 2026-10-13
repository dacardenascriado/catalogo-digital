/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de la marca (tomada del logo)
        rosegold: {
          DEFAULT: '#B76E79', // Oro rosa principal
          deep: '#9E5560', // Variante oscura para texto/botones con buen contraste
        },
        copper: {
          DEFAULT: '#C27C5E', // Cobre
          dark: '#8A4B3A', // Cobre oscuro: textos destacados, hover
        },
        blush: '#F6DDD6', // Rosa suave: fondos de sección, chips
        marble: '#FCF7F5', // Blanco mármol: fondo general
        ink: {
          DEFAULT: '#3A2A26', // Texto principal
          soft: '#6B5650', // Texto secundario (contraste AA sobre mármol)
        },
      },
      fontFamily: {
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(138,75,58,0.06), 0 8px 24px -8px rgba(138,75,58,0.14)',
        lift: '0 2px 4px rgba(138,75,58,0.06), 0 18px 40px -12px rgba(138,75,58,0.25)',
        glow: '0 0 0 4px rgba(183,110,121,0.18)',
      },
      backgroundImage: {
        metal: 'linear-gradient(135deg, #B76E79 -25%, #A35A65 25%, #9A5A45 70%, #8A4B3A 110%)',
        'metal-soft': 'linear-gradient(135deg, #F6DDD6 0%, #EFC9BE 50%, #F6DDD6 100%)',
        'metal-text': 'linear-gradient(120deg, #9E5560 0%, #C27C5E 45%, #8A4B3A 100%)',
      },
      keyframes: {
        sheen: {
          '0%': { transform: 'translateX(-120%) skewX(-20deg)' },
          '100%': { transform: 'translateX(220%) skewX(-20deg)' },
        },
        bump: {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.35)' },
          '60%': { transform: 'scale(0.9)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.96)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        sheen: 'sheen 0.9s ease-out',
        bump: 'bump 0.45s ease-out',
        'fade-up': 'fade-up 0.5s ease-out both',
        shimmer: 'shimmer 1.4s infinite',
        'toast-in': 'toast-in 0.3s ease-out both',
      },
    },
  },
  plugins: [],
}

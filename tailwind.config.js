const plugin = require('tailwindcss/plugin')

module.exports = {
  jit: true,
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or false or 'media'
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'Helvetica Neue','Arial','Helvetica', 'sans-serif'],
        circular: ['Circular Std Book', '-apple-system', 'system-ui', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
      }
    },
  },
  variants: {
    extend: {
      margin: ['last'],
      backgroundColor: ['active', 'odd', 'even'],
      opacity: ['disabled'],
      cursor: ['disabled']
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
    
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    })
  ],
}

/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'spaceDark',
    themes: {
      spaceDark: {
        dark: true,
        colors: {
          background: '#07101f',
          surface: '#111b31',
          primary: '#5c91ff',
          secondary: '#7ee7d8',
          error: '#ff6b7a',
        },
      },
    },
  },
})

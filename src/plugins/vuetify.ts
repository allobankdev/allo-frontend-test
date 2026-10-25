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
    defaultTheme: 'dark',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1B3A6B',
          secondary: '#546E7A',
          accent: '#FF6A3D',
          background: '#F4F6F8',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#5C8DE8',
          secondary: '#90A4AE',
          accent: '#FF6A3D',
          background: '#0E1420',
          surface: '#161D2B',
        },
      },
    },
  },
})

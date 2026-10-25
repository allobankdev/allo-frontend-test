/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'spaceDark',
    themes: {
      spaceDark: {
        dark: true,
        colors: {
          background: '#0a0d14',
          surface: '#121826',
          'surface-bright': '#1a2234',
          'surface-light': '#222d42',
          primary: '#38bdf8', // SpaceX vibrant sky blue
          secondary: '#818cf8',
          accent: '#06b6d4',
          error: '#f43f5e',
          info: '#38bdf8',
          success: '#10b981',
          warning: '#f59e0b',
        },
      },
    },
  },
})

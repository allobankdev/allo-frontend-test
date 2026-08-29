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
    defaultTheme: 'alloBank',
    themes: {
      alloBank: {
        dark: false,
        colors: {
          background: '#eef4ff',
          surface: '#ffffff',
          primary: '#1d4ed8',
          secondary: '#0f766e',
          success: '#15803d',
          warning: '#b45309',
          error: '#b91c1c',
        },
      },
    },
  },
})

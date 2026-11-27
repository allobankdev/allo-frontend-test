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
      dark: {
        colors: {
          primary: '#ffbc25', // Allo Bank Signature Yellow
          secondary: '#216ba5', // Allo Bank Blue
          accent: '#ffbc25',
          error: '#da473f', // Allo Bank Red
          success: '#17a16e', // Allo Bank Green
          warning: '#ffbc25',
          background: '#0a101d', // Allo Bank Deep Dark Neutral
          surface: '#131c2e', // Elevated Surface
        },
      },
    },
  },
})

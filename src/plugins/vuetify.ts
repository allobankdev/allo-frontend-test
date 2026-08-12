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

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#FF6B35',
          secondary: '#FFB800',
          accent: '#FFB800',
          surface: '#1E1E28',
          background: '#0A0A0F',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFB800',
        },
      },
    },
  },
})

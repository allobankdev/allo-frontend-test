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
        dark: true,
        colors: {
          primary: '#E5A93C', // Warm Gold / Aerospace Amber (Sesuai Referensi mychess.events)
          secondary: '#D4AF37',
          background: '#0B0E14', // Deep Obsidian Dark
          surface: '#111622', // Cosmic Card Surface
          'surface-light': '#182030', // Action & Header surfaces
          'on-primary': '#0B0E14', // High contrast on gold buttons
          'on-surface': '#F1F5F9',
          'on-background': '#F1F5F9',
          info: '#38BDF8',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
      },
    },
  },
})

/**
 * plugins/vuetify.ts — Custom dark "space" theme
 */

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'spaceTheme',
    themes: {
      spaceTheme: {
        dark: true,
        colors: {
          // Primary — electric blue
          primary: '#4F8EF7',
          'primary-darken-1': '#2563EB',
          // Secondary — cyan accent
          secondary: '#22D3EE',
          'secondary-darken-1': '#06B6D4',
          // Surface / backgrounds
          background: '#090D1A',
          surface: '#111827',
          'surface-variant': '#1A2235',
          'on-surface': '#E2E8F0',
          // States
          error: '#EF4444',
          warning: '#F59E0B',
          success: '#22C55E',
          info: '#38BDF8',
          // On-colors
          'on-primary': '#FFFFFF',
          'on-secondary': '#0F172A',
          'on-background': '#E2E8F0',
          'on-error': '#FFFFFF',
        },
      },
    },
  },
})

/**
 * plugins/vuetify.ts
 *
 * Minimalist, elegant light theme configuration
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#0f172a', // Slate 900 - sleek obsidian
          secondary: '#475569', // Slate 600
          accent: '#2563eb', // Clean Royal Blue
          background: '#f8fafc', // Slate 50 - clean off-white
          surface: '#ffffff', // Pure white
          'surface-variant': '#f1f5f9', // Slate 100
          'on-surface-variant': '#64748b',
          error: '#ef4444',
          info: '#0284c7',
          success: '#059669', // Emerald
          warning: '#d97706',
        },
      },
    },
  },
  defaults: {
    VCard: {
      elevation: 0,
    },
    VBtn: {
      elevation: 0,
    },
  },
})

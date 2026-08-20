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
    defaultTheme: 'alloLight',
    themes: {
      alloLight: {
        dark: false,
        colors: {
          background: '#f3f5f6',
          surface: '#ffffff',
          primary: '#075d68',
          secondary: '#d64b45',
          info: '#2563a6',
          success: '#237a55',
          warning: '#a85d12',
          error: '#b4232d',
          'on-background': '#182126',
          'on-surface': '#182126',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'sm',
    },
    VCard: {
      rounded: 'lg',
    },
    VTextField: {
      color: 'primary',
      variant: 'outlined',
    },
  },
})

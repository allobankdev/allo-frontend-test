import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#007AFF',
          error: '#FF3B30',
          success: '#34C759',
          warning: '#FF9500',
          background: '#F2F2F7',
          surface: '#FFFFFF',
        },
      },
      dark: {
        colors: {
          primary: '#0A84FF',
          error: '#FF453A',
          success: '#30D158',
          warning: '#FF9F0A',
          background: '#000000',
          surface: '#1C1C1E',
        },
      },
    },
    variations: {
      colors: ['primary', 'error', 'success', 'warning'],
      lighten: 2,
      darken: 2,
    },
  },
  defaults: {
    VBtn: {
      style: 'min-height: 44px; min-width: 44px;',
      rounded: 'lg',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VCard: {
      rounded: 'lg',
    },
  },
})

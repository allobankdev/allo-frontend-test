import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'

const fieldDefaults = {
  variant: 'outlined',
  density: 'comfortable',
  rounded: 'lg',
  color: 'primary',
} as const

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          'surface-light': '#F4F6FA',
          primary: '#2563EB',
          secondary: '#0F172A',
          success: '#16A34A',
          error: '#DC2626',
          'on-background': '#0F172A',
          'on-surface': '#0F172A',
        },
      },
    },
  },
  defaults: {
    VBtn: { rounded: 'lg', class: 'text-none font-weight-semibold', elevation: 0 },
    VCard: { rounded: 'xl', elevation: 0 },
    VChip: { rounded: 'lg' },
    VTextField: fieldDefaults,
    VTextarea: fieldDefaults,
    VSelect: fieldDefaults,
    VCombobox: fieldDefaults,
  },
})

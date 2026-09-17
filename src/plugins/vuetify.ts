import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const fieldDefaults = {
  variant: 'outlined',
  density: 'comfortable',
  rounded: 0,
  hideDetails: 'auto',
}

export default createVuetify({
  theme: {
    defaultTheme: 'mono',
    themes: {
      mono: {
        dark: false,
        colors: {
          'background': '#f4f4f4',
          'surface': '#ffffff',
          'primary': '#111111',
          'secondary': '#555555',
          'error': '#b00020',
          'on-surface': '#111111',
        },
      },
    },
  },
  defaults: {
    VBtn: { rounded: 0, flat: true },
    VCard: { rounded: 0, flat: true, border: true },
    VTextField: fieldDefaults,
    VTextarea: fieldDefaults,
    VSelect: fieldDefaults,
    VChip: { rounded: 0, size: 'small', variant: 'outlined' },
    VAppBar: { flat: true, border: 'b' },
  },
})

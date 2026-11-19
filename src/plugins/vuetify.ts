import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#EEF2F6',
          surface: '#FFFFFF',
          'surface-variant': '#E4E9F0',
          primary: '#1B4F72',
          secondary: '#5D6D7E',
          error: '#C0392B',
          info: '#2E86C1',
          success: '#1E8449',
          warning: '#B9770E',
          'on-background': '#1C2833',
          'on-surface': '#1C2833',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
    },
    VCard: {
      rounded: 'lg',
      elevation: 1,
    },
    VTextField: {
      color: 'primary',
    },
    VTextarea: {
      color: 'primary',
    },
  },
})

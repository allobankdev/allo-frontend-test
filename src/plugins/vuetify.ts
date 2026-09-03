import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'astroLight',
    themes: {
      astroLight: {
        dark: false,
        colors: {
          background: '#f8fafc',
          surface: '#ffffff',
          'surface-variant': '#f1f5f9',
          primary: '#0b2545',
          'primary-darken-1': '#06162a',
          secondary: '#38bdf8',
          'secondary-darken-1': '#0284c7',
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#3b82f6',
          success: '#10b981',
        },
      },
    },
  },
})

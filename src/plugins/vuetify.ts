/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@/styles/tokens.scss'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          'surface-variant': '#FAFAFA',
          'on-surface-variant': '#6B7280',
          primary: '#2547D0',
          'primary-darken-1': '#1B36A3',
          error: '#C4372B',
          outline: '#E4E4E7',
        },
      },
    },
  },
  defaults: {
    VCard: { elevation: 0 },
    VBtn: { elevation: 0 },
    VAppBar: { elevation: 0 },
    VTextField: { variant: 'outlined', density: 'comfortable' },
    VTextarea: { variant: 'outlined', density: 'comfortable' },
    VSelect: { variant: 'outlined', density: 'comfortable' },
  },
})
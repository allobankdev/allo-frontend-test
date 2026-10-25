/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'manifestTheme',
    themes: {
      manifestTheme: {
        dark: false,
        colors: {
          background: '#EDEBE4',
          surface: '#EDEBE4',
          primary: '#C4571E', // Signal orange/rust accent
          secondary: '#5B6470', // Steel grey
          steel: '#5B6470', // Steel grey explicit
          onBackground: '#1B1D22',
          onSurface: '#1B1D22',
          onPrimary: '#FFFFFF',
          onSecondary: '#FFFFFF',
          onSteel: '#FFFFFF',
          info: '#5B6470',
          success: '#3D6B4F',
          warning: '#C4571E',
          error: '#B00020',
          line: '#C7C2B6',
        },
      },
    },
  },
  defaults: {
    VCard: {
      variant: 'outlined',
      rounded: 'sm',
      color: 'line',
    },
    VBtn: {
      rounded: 'sm',
      elevation: 0,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'sm',
      color: 'primary',
    },
    VDialog: {
      width: '560px',
    },
    VProgressLinear: {
      color: 'primary',
      height: 3,
    },
  },
})

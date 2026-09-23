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
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#0a0a0a',
          surface: '#141414',
          'surface-variant': '#222222',
          primary: '#ffffff',
          'on-primary': '#000000',
          secondary: '#d4d4d8',
          'on-secondary': '#000000',
          info: '#a1a1aa',
          success: '#e4e4e7',
          warning: '#d4d4d8',
          error: '#f43f5e',
          'on-background': '#fafafa',
          'on-surface': '#f4f4f5',
        },
      },
    },
  },
})

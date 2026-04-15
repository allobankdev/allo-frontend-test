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
    defaultTheme: 'customDark',
    themes: {
      customDark: {
        dark: true,
        colors: {
          background: '#1E1821',
          surface: '#1E1821',
          'on-background': '#FFFFFF',
          'on-surface': '#FFFFFF',
          primary: '#1E1821',
          'on-primary': '#FFFFFF',
        },
      },
    },
  },
  defaults: {
    global: {
      style: {
        fontFamily: "'Exo 2', sans-serif",
        fontWeight: '400',
      },
    },
  },
})

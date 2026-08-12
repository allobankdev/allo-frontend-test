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
    defaultTheme: 'aerospace',
    themes: {
      aerospace: {
        dark: false,
        colors: {
          background: '#F6F4EF',
          surface: '#FFFFFF',
          primary: '#17359E',
          'on-background': '#14161B',
          'on-surface': '#14161B',
        },
      },
    },
  },
})

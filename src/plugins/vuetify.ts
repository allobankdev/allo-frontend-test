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
/** Instance Vuetify aplikasi dengan tema gelap sebagai bawaan. */
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
  },
})

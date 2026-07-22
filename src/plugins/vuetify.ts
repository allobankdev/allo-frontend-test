/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { id } from 'vuetify/locale'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VDateInput,
  },
  locale: {
    locale: 'id',
    messages: { id }
  },
  theme: {
    defaultTheme: 'dark',
  },
})

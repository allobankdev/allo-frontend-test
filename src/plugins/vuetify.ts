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

const spaceDark = {
  dark: true,
  colors: {
    background: '#05060f',
    surface: '#10132e',
    'surface-bright': '#191d4a',
    primary: '#7c5cff',
    secondary: '#00e5ff',
    accent: '#ff6ec7',
    error: '#ff5470',
    info: '#38bdf8',
    success: '#34d399',
    warning: '#fbbf24',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'spaceDark',
    themes: { spaceDark },
  },
})

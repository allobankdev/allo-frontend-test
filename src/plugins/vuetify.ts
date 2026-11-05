/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify, type ThemeDefinition } from 'vuetify'

const aerospaceDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#090d16',
    surface: '#111726',
    'surface-variant': '#1a233a',
    'surface-bright': '#23304e',
    primary: '#38bdf8', // crisp aerospace cyan
    'primary-darken-1': '#0284c7',
    secondary: '#94a3b8',
    'secondary-darken-1': '#64748b',
    accent: '#f59e0b',
    error: '#f43f5e',
    info: '#0ea5e9',
    success: '#10b981',
    warning: '#f59e0b',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'aerospaceDark',
    themes: {
      aerospaceDark: aerospaceDarkTheme,
    },
  },
})

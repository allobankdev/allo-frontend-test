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
    background: '#080c14',
    surface: '#0f1626',
    'surface-variant': '#162035',
    'surface-bright': '#1e293b',
    primary: '#38bdf8', // Liquid Oxygen cyan
    'primary-darken-1': '#0284c7',
    secondary: '#94a3b8',
    'secondary-darken-1': '#64748b',
    accent: '#f59e0b', // Thermal amber
    error: '#f43f5e',
    info: '#38bdf8',
    success: '#10b981', // Operational green
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

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

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#0B1020',
    surface: '#131B2E',
    'surface-bright': '#1C2742',
    'surface-light': '#243252',
    'surface-variant': '#2A395C',
    'on-surface-variant': '#E2E8F0',
    primary: '#6366F1',
    'primary-darken-1': '#4F46E5',
    secondary: '#06B6D4',
    'secondary-darken-1': '#0891B2',
    error: '#F87171',
    info: '#38BDF8',
    success: '#34D399',
    warning: '#FBBF24',
  },
}

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#F4F6FB',
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-light': '#EEF2F9',
    'surface-variant': '#E2E8F0',
    'on-surface-variant': '#1E293B',
    primary: '#4F46E5',
    'primary-darken-1': '#3730A3',
    secondary: '#0891B2',
    'secondary-darken-1': '#0E7490',
    error: '#DC2626',
    info: '#0284C7',
    success: '#059669',
    warning: '#D97706',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: darkTheme,
      light: lightTheme,
    },
  },
})

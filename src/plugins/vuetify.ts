/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com
 */

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'

/** Dark "space" theme. All text/background pairs meet WCAG AA (≥ 4.5:1). */
const spaceTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#0b1020',
    surface: '#141b2d',
    'surface-bright': '#1e2740',
    'surface-variant': '#c9d1e6',
    'on-surface-variant': '#141b2d',
    primary: '#6c9bff',
    secondary: '#b69cff',
    success: '#4ade80',
    info: '#38bdf8',
    warning: '#fbbf24',
    error: '#f87171',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'space',
    themes: { space: spaceTheme },
  },
  defaults: {
    VBtn: { rounded: 'lg' },
    VCard: { rounded: 'lg' },
    VTextField: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VTextarea: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VSelect: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VAutocomplete: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VSwitch: { color: 'primary', inset: true, hideDetails: true },
    VChip: { rounded: 'lg' },
  },
})

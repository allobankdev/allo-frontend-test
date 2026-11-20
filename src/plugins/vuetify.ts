/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/600.css'

// Composables
import { createVuetify, type ThemeDefinition } from 'vuetify'

const prefersLight =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: light)').matches

const fleetDark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#0A0B0D',
    surface: '#121417',
    'surface-bright': '#1B1F24',
    'surface-light': '#1B1F24',
    'surface-variant': '#191C20',
    'on-surface': '#E8E6E1',
    'on-surface-variant': '#B9B7B1',
    'on-background': '#E8E6E1',
    primary: '#FF5C1A',
    'primary-darken-1': '#E04A0B',
    secondary: '#9A9A97',
    'secondary-darken-1': '#7C7C79',
    error: '#FF6B5A',
    info: '#8FA3B8',
    success: '#8FBF7F',
    warning: '#E8B54D',
    'on-primary': '#0A0B0D',
  },
  variables: {
    'border-color': '232,230,225',
    'border-opacity': 0.16,
    'high-emphasis-opacity': 0.94,
    'medium-emphasis-opacity': 0.66,
    'disabled-opacity': 0.4,
  },
}

const fleetLight: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#F1F1EE',
    surface: '#FBFBF9',
    'surface-bright': '#FFFFFF',
    'surface-light': '#F5F5F2',
    'surface-variant': '#E6E6E1',
    'on-surface': '#111214',
    'on-surface-variant': '#45464A',
    'on-background': '#111214',
    primary: '#C2410C',
    'primary-darken-1': '#9A3309',
    secondary: '#6E6E69',
    'secondary-darken-1': '#55554F',
    error: '#B3261E',
    info: '#3F5C7A',
    success: '#3F6B3A',
    warning: '#8A5A00',
    'on-primary': '#FFFFFF',
  },
  variables: {
    'border-color': '17,18,20',
    'border-opacity': 0.18,
    'high-emphasis-opacity': 0.94,
    'medium-emphasis-opacity': 0.68,
    'disabled-opacity': 0.42,
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: prefersLight ? 'fleet-light' : 'fleet',
    themes: {
      fleet: fleetDark,
      'fleet-light': fleetLight,
    },
  },
  defaults: {
    VBtn: {
      flat: true,
      rounded: 0,
    },
    VCard: {
      elevation: 0,
      rounded: 0,
    },
    VSheet: {
      rounded: 0,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: 'auto',
      rounded: 0,
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: 'auto',
      rounded: 0,
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 0,
    },
    VSwitch: {
      color: 'primary',
      hideDetails: 'auto',
      density: 'compact',
    },
    VSnackbar: {
      rounded: 0,
    },
  },
})

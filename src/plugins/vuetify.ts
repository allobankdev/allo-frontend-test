import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const rocketTheme = {
  dark: false,
  colors: {
    primary: '#0B3D91',
    secondary: '#1B1B2F',
    accent: '#FF6B35',
    error: '#D64545',
    background: '#F5F6FA',
    surface: '#FFFFFF',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'rocketTheme',
    themes: { rocketTheme },
  },
  defaults: {
    VCard: { rounded: 'lg' },
    VBtn: { rounded: 'lg' },
  },
})

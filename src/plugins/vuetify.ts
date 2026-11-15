import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: { primary: '#2458dd', background: '#f6f7f9', surface: '#ffffff' },
      },
    },
  },
  defaults: {
    VBtn: { rounded: 'lg', style: 'text-transform: none; letter-spacing: 0; font-weight: 600;', height: 44 },
  },
})

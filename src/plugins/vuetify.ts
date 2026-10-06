import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
export default createVuetify({
  theme: {
    defaultTheme: 'rocketLight',
    themes: {
      rocketLight: {
        colors: {
          background: '#F5F7FA',
          surface: '#FFFFFF',
          primary: '#0A55C7',
          secondary: '#52616B',
          error: '#B42318',
        },
        dark: false,
      },
    },
  },
})

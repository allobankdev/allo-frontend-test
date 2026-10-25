import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'rocketLight',
    themes: {
      rocketLight: {
        dark: false,
        colors: {
          background: '#f4f6f5',
          surface: '#ffffff',
          primary: '#d8462f',
          secondary: '#19343d',
          error: '#b3261e',
          info: '#315f72',
          success: '#25734a',
          warning: '#926500',
        },
      },
    },
  },
})

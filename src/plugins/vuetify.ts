/**
 * Fungsi: Setting tema gelap Vuetify (aerospaceCarbon) sama default styling buat tombol
 *         dan input biar konsisten di semua halaman.
 * Dipakai di:
 *  - src/plugins/index.ts (didaftarin ke app Vue)
 */

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'aerospaceCarbon',
    themes: {
      aerospaceCarbon: {
        dark: true,
        colors: {
          background: '#0E0F11',
          surface: '#16181C',
          'surface-variant': '#1E2126',
          primary: '#EA580C',
          secondary: '#E4E4E7',
          error: '#F87171',
          'on-background': '#F4F4F5',
          'on-surface': '#F4F4F5',
          'on-primary': '#FFFFFF',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none; letter-spacing: 0.01em; font-weight: 600;',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
  },
})
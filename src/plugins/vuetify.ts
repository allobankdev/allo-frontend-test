/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com
 */

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";

export default createVuetify({
  theme: {
    defaultTheme: "missionSlate",
    themes: {
      missionSlate: {
        dark: true,
        colors: {
          background: "#0B1017",
          surface: "#131B24",
          "surface-variant": "#1A2430",
          primary: "#3B82F6",
          "on-background": "#F1F5F9",
          "on-surface": "#F1F5F9",
          error: "#EF4444",
        },
      },
    },
  },
});

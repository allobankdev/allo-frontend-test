/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "missionControl",
    themes: {
      missionControl: {
        dark: true,
        colors: {
          background: "#0a0d12",
          surface: "#12161d",
          primary: "#ff7a30",
          secondary: "#4fd1c5",
          error: "#ff5470",
        },
      },
    },
  },
});

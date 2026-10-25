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
const theme = {
  dark: false,
  colors: {
    background: "#F8F8F7",
    surface: "#FFFFFF",
    "surface-variant": "#1c2c4b",

    primary: "#FF5A1F",
    "primary-darken-1": "#D9480F",

    secondary: "#1F2937",
    accent: "#F59E0B",

    success: "#16A34A",
    warning: "#F59E0B",
    error: "#DC2626",
    info: "#0284C7",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "theme",
    themes: {
      theme,
    },
  },
});

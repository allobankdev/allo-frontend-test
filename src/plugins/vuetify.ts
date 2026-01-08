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
    defaultTheme: "dark",
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: "#1976D2",
          secondary: "#FFBC25",
          surface: "#1E1E1E",
          background: "#121212",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FF9800",
        },
      },
      light: {
        dark: false,
        colors: {
          primary: "#1976D2",
          secondary: "#FFBC25",
          surface: "#FFFFFF",
          background: "#F5F5F5",
          error: "#F44336",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FF9800",
        },
      },
    },
  },
  defaults: {
    VCard: {
      rounded: "lg",
      elevation: 2,
    },
    VBtn: {
      rounded: "md",
      elevation: 0,
    },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
    },
    VSelect: {
      variant: "outlined",
      density: "comfortable",
    },
    VTextarea: {
      variant: "outlined",
      density: "comfortable",
    },
  },
});

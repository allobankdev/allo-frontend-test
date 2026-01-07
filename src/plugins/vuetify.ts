import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";

type ThemePreference = "light" | "dark" | "system";

const savedPreference =
  (localStorage.getItem("vuetify-theme") as ThemePreference) ?? "system";

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const resolvedTheme =
  savedPreference === "system"
    ? prefersDark
      ? "dark"
      : "light"
    : savedPreference;

export default createVuetify({
  theme: {
    defaultTheme: resolvedTheme,
    themes: {
      light: {},
      dark: {},
    },
  },
});

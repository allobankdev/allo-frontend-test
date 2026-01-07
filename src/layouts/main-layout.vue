<template>
  <v-responsive class="border rounded">
    <v-app-bar title="Rocket SpaceX">
      <template #append>
        <v-menu location="bottom end">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              aria-label="Theme selector"
            >
              <v-icon>
                {{
                  preference === "system"
                    ? "mdi-cog"
                    : isDark
                      ? "mdi-weather-night"
                      : "mdi-white-balance-sunny"
                }}
              </v-icon>
            </v-btn>
          </template>

          <v-list density="compact">
            <v-list-item
              :active="preference === 'light'"
              @click="setTheme('light')"
            >
              <v-list-item-title>Light</v-list-item-title>
            </v-list-item>

            <v-list-item
              :active="preference === 'dark'"
              @click="setTheme('dark')"
            >
              <v-list-item-title>Dark</v-list-item-title>
            </v-list-item>

            <v-list-item
              :active="preference === 'system'"
              @click="setTheme('system')"
            >
              <v-list-item-title>System</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-responsive>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from "vue";
import { useTheme } from "vuetify";

type ThemePreference = "light" | "dark" | "system";

const theme = useTheme();

const preference = ref<ThemePreference>(
  (localStorage.getItem("vuetify-theme") as ThemePreference) ?? "system"
);

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

const isDark = computed(() =>
  preference.value === "system"
    ? prefersDark.matches
    : preference.value === "dark"
);

function applyTheme() {
  theme.change(isDark.value ? "dark" : "light");
}

function setTheme(value: ThemePreference) {
  preference.value = value;
}

const mediaListener = () => {
  if (preference.value === "system") {
    applyTheme();
  }
};

prefersDark.addEventListener("change", mediaListener);

onUnmounted(() => {
  prefersDark.removeEventListener("change", mediaListener);
});

watch(
  preference,
  () => {
    localStorage.setItem("vuetify-theme", preference.value);
    applyTheme();
  },
  { immediate: true }
);
</script>

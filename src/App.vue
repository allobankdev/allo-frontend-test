<template>
  <v-app>
    <!-- Top Navigation App Bar -->
    <v-app-bar
      class="border-b"
      density="comfortable"
      elevation="1"
    >
      <v-container class="d-flex align-center py-0">
        <router-link
          class="d-flex align-center ga-2 text-decoration-none text-high-emphasis"
          to="/"
        >
          <v-avatar
            color="primary"
            size="36"
          >
            <v-icon
              color="white"
              icon="mdi-rocket-launch"
              size="20"
            />
          </v-avatar>
          <span class="text-h6 font-weight-bold tracking-wide">SpaceX Fleet</span>
        </router-link>

        <v-spacer />

        <!-- Theme Toggle -->
        <v-btn
          :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="text"
          @click="toggleTheme"
        />
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <!-- Footer -->
    <v-footer class="border-t py-4 text-center d-flex justify-center text-caption text-medium-emphasis">
      <span>Allo Bank Frontend Technical Assignment &bull; Launch Library 2 API</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<style scoped>
.tracking-wide {
  letter-spacing: 0.03em;
}
</style>

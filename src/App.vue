<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" elevation="2" density="comfortable">
      <v-app-bar-title>
        <div class="d-flex align-center cursor-pointer" @click="$router.push('/')">
          <v-icon icon="mdi-rocket-launch" class="mr-2" />
          <span class="font-weight-bold">RocketHub</span>
        </div>
      </v-app-bar-title>

      <template #append>
        <v-btn
          :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="text"
          @click="toggleTheme"
        />
      </template>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

const isDark = computed(() => theme.global.current.value.dark)

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <v-app>
    <v-app-bar
      elevation="1"
      density="comfortable"
    >
      <v-app-bar-title
        class="font-weight-bold d-flex align-center cursor-pointer"
        @click="router.push('/')"
      >
        <v-icon
          icon="mdi-rocket"
          color="primary"
          class="mr-2"
        />
        <span>SpaceX Fleet Explorer</span>
      </v-app-bar-title>

      <v-spacer />

      <!-- Quick home navigation -->
      <v-btn
        variant="text"
        prepend-icon="mdi-home"
        @click="router.push('/')"
      >
        Fleet
      </v-btn>

      <!-- Theme toggle -->
      <v-btn
        icon="mdi-theme-light-dark"
        variant="text"
        @click="toggleTheme"
      />
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer class="text-center d-flex flex-column py-4 mt-8 bg-surface-variant">
      <div class="text-caption text-medium-emphasis">
        SpaceX Fleet Explorer &bull; Allo Bank Frontend Technical Assignment &bull; Built with Vue 3, Vuetify & Pinia
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';

const router = useRouter();
const theme = useTheme();

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}
</script>

<style>
.cursor-pointer {
  cursor: pointer;
}
</style>

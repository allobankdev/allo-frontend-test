<template>
  <v-app class="app-root">
    <!-- Monochrome Navigation Bar -->
    <AppNavbar @open-add-dialog="isAddDialogOpen = true" />

    <!-- Main Content View -->
    <v-main class="main-content">
      <router-view />
    </v-main>

    <!-- Global Add Rocket Dialog -->
    <RocketAddDialog
      v-model="isAddDialogOpen"
      @created="handleRocketCreated"
    />

    <!-- Minimalist Footer -->
    <footer class="app-footer border-t py-6 text-center text-caption text-grey">
      <v-container>
        <div class="d-flex flex-column flex-sm-row justify-space-between align-center gap-2">
          <div>
            &copy; {{ new Date().getFullYear() }} SpaceX Launch Vehicle Catalog. Allo Bank Technical Test.
          </div>
          <div>
            Data provided by <a
              href="https://thespacedevs.com/llapi"
              target="_blank"
              rel="noopener noreferrer"
              class="text-grey-lighten-1 text-decoration-none"
            >Launch Library 2 API</a>
          </div>
        </div>
      </v-container>
    </footer>

    <!-- Global Success Notification -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="3500"
      color="#18181b"
      variant="flat"
      class="border-subtle"
      location="bottom right"
    >
      <div class="d-flex align-center gap-2 text-white">
        <v-icon
          icon="mdi-check-circle-outline"
          color="white"
          size="20"
        />
        <span>Roket baru berhasil ditambahkan ke daftar!</span>
      </div>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'
import RocketAddDialog from '@/components/RocketAddDialog.vue'

const isAddDialogOpen = ref(false)
const showSnackbar = ref(false)

function handleRocketCreated() {
  showSnackbar.value = true
}
</script>

<style>
/* Global Monochrome Styles */
:root {
  --bg-primary: #0a0a0a;
  --bg-surface: #141416;
  --text-main: #f4f4f5;
  --border-color: #27272a;
}

body {
  background-color: #0a0a0a !important;
  color: #f4f4f5 !important;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.app-root {
  background-color: #0a0a0a !important;
}

.main-content {
  background-color: #0a0a0a;
  min-height: calc(100vh - 120px);
}

.app-footer {
  background-color: #0a0a0a;
  border-top: 1px solid #222224;
}

.border-subtle {
  border: 1px solid #27272a !important;
}

.border-t {
  border-top: 1px solid #222224 !important;
}

.gap-2 {
  gap: 0.5rem;
}
</style>

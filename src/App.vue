<template>
  <v-app class="app-background">
    <AppNavbar @open-add-dialog="rocketStore.openAddDialog()" />

    <v-main>
      <router-view />
    </v-main>

    <RocketAddDialog
      v-model="rocketStore.isAddDialogOpen"
      @created="handleRocketCreated"
    />

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3500"
      location="top right"
      rounded="lg"
      elevation="4"
    >
      <div class="d-flex align-center font-weight-medium">
        <v-icon
          :icon="snackbar.icon"
          class="mr-2"
        />
        <span>{{ snackbar.message }}</span>
      </div>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import type { NewRocketInput } from '@/types/rocket'
import AppNavbar from '@/components/AppNavbar.vue'
import RocketAddDialog from '@/components/RocketAddDialog.vue'

const rocketStore = useRocketStore()

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success',
  icon: 'mdi-check-circle',
})

function handleRocketCreated(payload: NewRocketInput) {
  const created = rocketStore.addRocket(payload)
  snackbar.message = `Rocket "${created.full_name}" added successfully!`
  snackbar.color = 'amber-darken-3'
  snackbar.icon = 'mdi-rocket-launch'
  snackbar.show = true
}
</script>

<style>
:root {
  --allo-primary: #ffbc25;
  --allo-primary-dark: #e5a415;
  --allo-secondary: #216ba5;
  --allo-navy-dark: #0a101d;
  --allo-navy-surface: #131c2e;
  --allo-navy-card: #182238;
  --allo-text-muted: #8b95a5;
  --allo-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --allo-font-heading: 'Montserrat', 'Inter', sans-serif;
}

.app-background {
  background-color: var(--allo-navy-dark) !important;
  color: #e2e8f0;
  min-height: 100vh;
  font-family: var(--allo-font-sans) !important;
}

h1, h2, h3, h4, h5, h6,
.text-h1, .text-h2, .text-h3, .text-h4, .text-h5, .text-h6 {
  font-family: var(--allo-font-heading) !important;
  letter-spacing: -0.015em;
}

body, button, input, select, textarea, .v-application {
  font-family: var(--allo-font-sans) !important;
}

/* Custom Allo Bank styling classes */
.btn-allo-primary {
  background-color: #ffbc25 !important;
  color: #0a101d !important;
  font-weight: 700 !important;
  font-family: var(--allo-font-heading) !important;
}
.btn-allo-primary:hover {
  background-color: #e5a415 !important;
}

.bg-allo-surface {
  background-color: #131c2e !important;
}

.border-allo {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}
</style>

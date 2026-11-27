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
.app-background {
  background-color: #0b0f19 !important;
  color: #e0e0e0;
  min-height: 100vh;
}
</style>

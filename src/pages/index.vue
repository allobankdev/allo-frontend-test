<template>
  <v-container class="py-8 max-width-xl">
    <!-- Header Hero Banner -->
    <v-card class="mb-8 pa-6 pa-md-10 rounded-2xl elevation-3 hero-card position-relative overflow-hidden">
      <div class="position-relative z-index-1">
        <div class="d-flex align-center gap-2 mb-2">
          <v-chip color="primary" variant="flat" size="small" class="font-weight-bold">SpaceX Launcher Fleet</v-chip>
          <v-chip color="surface" variant="tonal" size="small" class="font-weight-medium">Launch Library 2.2.0</v-chip>
        </div>
        <h1 class="text-h4 text-sm-h3 text-md-h2 font-weight-black mb-3">
          SpaceX Rocket Catalogue
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis max-width-md">
          Explore orbital launchers, heavy-lift rockets, and next-generation interplanetary vehicles developed by SpaceX.
        </p>

        <!-- Action Row: Search & Add Button -->
        <v-row class="mt-6 align-center">
          <v-col cols="12" md="8">
            <v-text-field
              v-model="rocketStore.searchQuery"
              placeholder="Filter rockets by name, description, or country..."
              variant="solo-filled"
              density="comfortable"
              prepend-inner-icon="mdi-magnify"
              clearable
              rounded="pill"
              hide-details
              elevation="1"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" class="text-md-end">
            <v-btn
              color="primary"
              size="large"
              rounded="pill"
              elevation="2"
              block
              prepend-icon="mdi-plus-circle-outline"
              @click="isAddModalOpen = true"
            >
              Add New Rocket
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <!-- Error State -->
    <ErrorRetryCard
      v-if="rocketStore.error"
      :message="rocketStore.error"
      @retry="rocketStore.loadRockets()"
    />

    <!-- Loading State (Skeleton Loaders) -->
    <v-row v-else-if="rocketStore.loading">
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-card rounded="xl" class="pa-4" elevation="1">
          <v-skeleton-loader type="image, article, actions"></v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty Filtered Results -->
    <v-card
      v-else-if="rocketStore.filteredRockets.length === 0"
      class="pa-10 text-center rounded-xl border-dashed my-8"
      elevation="0"
    >
      <v-icon size="64" color="medium-emphasis" class="mb-3">mdi-rocket-off-outline</v-icon>
      <h3 class="text-h6 font-weight-bold">No Rockets Found</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        No rockets matched your filter query "{{ rocketStore.searchQuery }}". Try searching for "Falcon" or "Starship".
      </p>
      <v-btn variant="tonal" rounded="pill" @click="rocketStore.searchQuery = ''">
        Clear Filter
      </v-btn>
    </v-card>

    <!-- Success State: Rockets Grid -->
    <v-row v-else>
      <v-col
        v-for="rocket in rocketStore.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        class="d-flex"
      >
        <RocketCard :rocket="rocket" class="w-100" />
      </v-col>
    </v-row>

    <!-- Add Custom Rocket Dialog -->
    <AddRocketDialog
      v-model="isAddModalOpen"
      @submit="handleAddRocket"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRocketStore } from '../stores/rocketStore'
import RocketCard from '../components/RocketCard.vue'
import ErrorRetryCard from '../components/ErrorRetryCard.vue'
import AddRocketDialog from '../components/AddRocketDialog.vue'

const rocketStore = useRocketStore()
const isAddModalOpen = ref(false)

onMounted(() => {
  if (rocketStore.apiRockets.length === 0) {
    rocketStore.loadRockets()
  }
})

function handleAddRocket(payload: any) {
  rocketStore.addCustomRocket(payload)
}
</script>

<style scoped>
.max-width-xl {
  max-width: 1280px;
}
.max-width-md {
  max-width: 680px;
}
.hero-card {
  background: linear-gradient(135deg, rgba(var(--v-theme-surface), 1) 0%, rgba(var(--v-theme-surface-variant), 0.3) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.z-index-1 {
  z-index: 1;
}
.border-dashed {
  border: 2px dashed rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>

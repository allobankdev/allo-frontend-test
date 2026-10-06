<template>
  <v-app-bar
    elevation="0"
  >
    <v-app-bar-title>SpaceX rocket catalogue</v-app-bar-title>
    <v-btn
      class="mr-2"
      color="primary"
      min-height="44"
      prepend-icon="mdi-plus"
      @click="isAddDialogOpen = true"
    >
      Add rocket
    </v-btn>
  </v-app-bar>

  <v-container class="page-shell">
    <header class="page-header">
      <div>
        <p class="eyebrow">
          Launch Library 2 data
        </p>
        <h1>Browse SpaceX rockets</h1>
        <p>Find a rocket by name or description, then open its full flight details.</p>
      </div>
      <v-text-field
        v-model="store.filterQuery"
        aria-label="Filter rockets by name or description"
        class="filter-input"
        clearable
        hide-details
        label="Filter rockets"
        prepend-inner-icon="mdi-magnify"
      />
    </header>

    <AppFeedback
      v-if="store.listStatus === 'loading'"
      message="Retrieving the current SpaceX rocket catalogue."
      state="loading"
      title="Loading rockets"
    />
    <AppFeedback
      v-else-if="store.listStatus === 'error'"
      :message="store.listError || 'Rocket data could not be loaded.'"
      state="error"
      title="The rocket catalogue is unavailable"
      @retry="store.loadRockets"
    />
    <AppFeedback
      v-else-if="store.listStatus === 'success' && !store.filteredRockets.length"
      message="Try a different name or description, or add a rocket for this session."
      state="empty"
      title="No rockets match that filter"
    />
    <v-row v-else-if="store.listStatus === 'success'">
      <v-col
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        cols="12"
        md="6"
        lg="4"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>
  </v-container>

  <AddRocketDialog
    v-model="isAddDialogOpen"
    @add="store.addRocket"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import AppFeedback from '@/components/AppFeedback.vue'
import RocketCard from '@/components/RocketCard.vue'
import { useRocketStore } from '@/stores/rockets'

const store = useRocketStore()
const isAddDialogOpen = ref(false)

onMounted(store.loadRockets)
</script>

<style scoped>
.page-shell { padding-bottom: 48px; padding-top: 48px; }
.page-header { align-items: end; display: flex; gap: 32px; justify-content: space-between; margin-bottom: 36px; }
.page-header h1 { color: #172033; font-size: clamp(2rem, 4vw, 3rem); line-height: 1.1; margin: 0; }
.page-header p:not(.eyebrow) { color: #52616b; margin: 12px 0 0; max-width: 620px; }
.eyebrow { color: #0a55c7; font-size: 0.875rem; font-weight: 700; margin: 0 0 8px; }
.filter-input { flex: 0 1 340px; }
@media (max-width: 760px) {
  .page-shell { padding-top: 28px; }
  .page-header { align-items: stretch; flex-direction: column; gap: 20px; margin-bottom: 28px; }
  .filter-input { flex-basis: auto; }
}
</style>

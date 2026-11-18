<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRocketStore } from '@/stores/rockets'
import AddRocketDialog from '@/components/AddRocketDialog.vue'

const store = useRocketStore()
const isDialogOpen = ref<boolean>(false)
const { rockets, filteredRockets, status, errorMessage, searchQuery, statusFilter, hasActiveFilter } =
  storeToRefs(store)

onMounted(() => {
  void store.loadRockets()
})
</script>

<template>
  <v-container max-width="1200" class="py-8">
    <div class="mb-6 d-flex flex-wrap align-center justify-space-between ga-4">
      <div>
        <h1 class="text-h4 font-weight-bold">SpaceX Rockets</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          {{ filteredRockets.length }} of {{ rockets.length }} rockets
          <span v-if="hasActiveFilter">· filtered</span>
        </p>
      </div>

      <v-btn color="primary" prepend-icon="mdi-plus" @click="isDialogOpen = true">
        Add rocket
      </v-btn>
    </div>

    <RocketFilterBar v-model:search="searchQuery" v-model:status="statusFilter" class="mb-6" />

    <StateWrapper :status="status" :error="errorMessage" @retry="store.loadRockets(true)">
      <v-row v-if="filteredRockets.length">
        <v-col v-for="rocket in filteredRockets" :key="rocket.id" cols="12" sm="6" lg="4">
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <v-alert v-else type="info" variant="tonal">
        <div class="d-flex flex-wrap align-center justify-space-between ga-4">
          <span>No rockets match your filter.</span>
          <v-btn variant="text" color="info" @click="store.resetFilters()">
            Reset filter
          </v-btn>
        </div>
      </v-alert>

      <AddRocketDialog v-model="isDialogOpen"/>
    </StateWrapper>
  </v-container>
</template>

<template>
  <div>
    <AppHeader />

    <v-container class="py-8 py-md-12">
      <div class="mb-8">
        <div class="text-overline text-primary">
          SpaceX
        </div>

        <h1 class="text-h3 text-md-h2 font-weight-bold">
          Rockets
        </h1>

        <p class="text-body-1 text-medium-emphasis mt-3">
          Explore SpaceX rocket configurations from Launch Library 2.
        </p>
      </div>

      <RocketFilter
        v-model="store.searchQuery"
        @add="showAddDialog = true"
      />

      <LoadingState v-if="store.loading" />

      <ErrorState
        v-else-if="store.error"
        :message="store.error"
        @retry="store.loadRockets"
      />

      <EmptyState
        v-else-if="store.filteredRockets.length === 0"
      />

      <template v-else>
        <div class="d-flex align-center justify-space-between mt-8 mb-4">
          <h2 class="text-h6 font-weight-bold">
            {{ store.filteredRockets.length }} Rockets
          </h2>
        </div>

        <v-row>
          <v-col
            v-for="rocket in store.filteredRockets"
            :key="rocket.id"
            cols="12"
            sm="6"
            lg="4"
          >
            <RocketCard :rocket="rocket" />
          </v-col>
        </v-row>
      </template>
    </v-container>

    <AddRocketDialog
      v-model="showAddDialog"
      @add="handleAddRocket"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useRocketStore } from '@/stores/rockets'

const store = useRocketStore()

const showAddDialog = ref(false)

function handleAddRocket(rocket: Parameters<typeof store.addRocket>[0]) {
  store.addRocket(rocket)
}

onMounted(() => {
  if (store.rockets.length === 0) {
    store.loadRockets()
  }
})
</script>
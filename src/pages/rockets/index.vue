<template>
  <v-app-bar flat>
    <v-app-bar-title class="font-weight-bold">SpaceX Rockets</v-app-bar-title>
    <v-spacer />
    <v-btn
      variant="text"
      prepend-icon="mdi-github"
      href="https://github.com/r-spacex/SpaceX-API"
      target="_blank"
      rel="noopener noreferrer"
    >
      API
    </v-btn>
  </v-app-bar>

  <v-main>
    <v-container class="py-6">
      <RocketFilters
        :query="store.filters.query"
        :country="store.filters.country"
        :active="store.filters.active"
        :countries="store.countries"
        @update:query="store.setFilters({ query: $event })"
        @update:country="store.setFilters({ country: $event })"
        @update:active="store.setFilters({ active: $event })"
        @add="addDialog = true"
      />

      <AddRocketDialog v-model="addDialog" @submit="onAdd" />

      <UiLoading v-if="store.status === 'loading'" />
      <UiErrorRetry
        v-else-if="store.status === 'error'"
        :message="store.error"
        @retry="store.loadRockets({ force: true })"
      />

      <template v-else>
        <v-row dense>
          <v-col
            v-for="rocket in store.filteredRockets"
            :key="rocket.id"
            cols="12"
            sm="6"
            md="4"
          >
            <RocketCard :rocket="rocket" :to="`/rockets/${rocket.id}`" />
          </v-col>
        </v-row>

        <v-alert
          v-if="store.status === 'success' && store.filteredRockets.length === 0"
          type="info"
          variant="tonal"
          rounded="lg"
          class="mt-6"
        >
          No rockets match your filter.
        </v-alert>
      </template>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRocketStore } from '@/stores/rockets'
import type { NewRocketInput } from '@/types/rocket'

import RocketCard from '@/components/RocketCard.vue'
import RocketFilters from '@/components/RocketFilters.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import UiLoading from '@/components/UiLoading.vue'
import UiErrorRetry from '@/components/UiErrorRetry.vue'

const store = useRocketStore()
const addDialog = ref(false)

onMounted(() => {
  // Lifecycle: fetch data when list screen is mounted
  store.loadRockets()
})

function onAdd (payload: NewRocketInput) {
  store.addRocket(payload)
}
</script>

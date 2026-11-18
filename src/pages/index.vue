<template>
  <v-container
    class="py-8"
    max-width="1200"
  >
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">
          Rocket List
        </h1>
        <p class="text-body-2 text-medium-emphasis">
          SpaceX rocket data from Launch Library 2
        </p>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-plus"
        @click="dialogOpen = true"
      >
        Add Rocket
      </v-btn>
    </div>

    <v-text-field
      v-model="store.searchQuery"
      label="Search name, description, or country"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      hide-details
      class="mb-6"
    />

    <AppStateView
      :status="store.listStatus"
      :error="store.listError"
      loading-text="Loading rockets..."
      @retry="store.loadRockets(true)"
    >
      <p
        class="text-body-2 text-medium-emphasis mb-4"
        aria-live="polite"
      >
        {{ store.filteredRockets.length }} rockets shown
      </p>

      <v-row v-if="store.filteredRockets.length">
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <div
        v-else
        class="text-center py-16 text-medium-emphasis"
      >
        No rockets match your search.
      </div>
    </AppStateView>

    <RocketFormDialog
      v-model="dialogOpen"
      @save="onSave"
    />

    <v-snackbar
      v-model="snackbar"
      timeout="3000"
      color="success"
    >
      Rocket "{{ lastAdded }}" added.
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import AppStateView from '@/components/AppStateView.vue'
import RocketCard from '@/components/RocketCard.vue'
import RocketFormDialog from '@/components/RocketFormDialog.vue'
import { useRocketStore } from '@/stores/rockets'
import type { NewRocketInput } from '@/types/rocket'

const store = useRocketStore()

const dialogOpen = ref(false)
const snackbar = ref(false)
const lastAdded = ref('')

onMounted(() => {
  store.loadRockets()
})

function onSave(input: NewRocketInput) {
  const rocket = store.addLocalRocket(input)
  lastAdded.value = rocket.name
  snackbar.value = true
}
</script>

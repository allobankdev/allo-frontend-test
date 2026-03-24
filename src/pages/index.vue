<template>
  <v-container class="py-8">
    <div class="d-flex flex-column ga-6">
      <div>
        <h1 class="text-h4 font-weight-bold">
          SpaceX Rockets
        </h1>
        <p class="text-body-1 text-medium-emphasis mt-1">
          Daftar rocket dari SpaceX API.
        </p>
      </div>

      <RocketFilter
        :model-value="store.state.filterKeyword"
        @update:model-value="store.setFilter"
      />

      <AddRocketForm @submit="store.addRocket" />

      <UiState
        :status="store.state.status"
        :error="store.state.error"
        @retry="store.retryFetchRockets"
      >
        <v-alert
          v-if="filteredRockets.length === 0"
          type="info"
          variant="tonal"
        >
          Data rocket tidak ditemukan dengan filter saat ini.
        </v-alert>

        <v-row v-else>
          <v-col
            v-for="rocket in filteredRockets"
            :key="rocket.id"
            cols="12"
            sm="6"
            lg="4"
          >
            <RocketCard :rocket="rocket" />
          </v-col>
        </v-row>
      </UiState>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import AddRocketForm from '@/components/AddRocketForm.vue'
  import RocketCard from '@/components/RocketCard.vue'
  import RocketFilter from '@/components/RocketFilter.vue'
  import UiState from '@/components/UiState.vue'
  import { useRocketStore } from '@/store/rocketStore'

  const store = useRocketStore()
  const filteredRockets = computed(() => store.filteredRockets.value)

  onMounted(async () => {
    if (store.state.status !== 'idle') return
    await store.fetchRockets()
  })
</script>


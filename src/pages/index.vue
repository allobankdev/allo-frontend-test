<template>
  <section>
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold">SpaceX rockets</h1>
      <p class="text-medium-emphasis mt-1">{{ subtitle }}</p>
    </div>

    <RocketFilterBar
      :model-value="store.searchQuery"
      @update:model-value="store.setSearchQuery"
      @add="isAddOpen = true"
    />

    <LoadingState v-if="store.status === 'loading'" />

    <ErrorState
      v-else-if="store.status === 'error'"
      :message="store.errorMessage ?? 'Unknown error.'"
      @retry="store.loadRockets(true)"
    />

    <p v-else-if="store.filteredRockets.length === 0" class="text-medium-emphasis text-center py-12">
      No rockets match "{{ store.searchQuery }}".
    </p>

    <v-row v-else>
      <v-col
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <AddRocketDialog
      v-if="isAddOpen"
      @close="isAddOpen = false"
      @submit="handleAddRocket"
    />
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import type { NewRocketInput } from '@/stores/rocketStore'
import RocketFilterBar from '@/components/RocketFilterBar.vue'
import RocketCard from '@/components/RocketCard.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'

const store = useRocketStore()
const isAddOpen = ref(false)

const subtitle = computed(() => {
  if (store.status !== 'success') return 'Fetched live from the Launch Library API.'
  const count = store.rockets.length
  return `${count} rocket${count === 1 ? '' : 's'} in the registry.`
})

onMounted(() => {
  store.loadRockets()
})

function handleAddRocket (payload: NewRocketInput) {
  store.addRocket(payload)
  isAddOpen.value = false
}
</script>

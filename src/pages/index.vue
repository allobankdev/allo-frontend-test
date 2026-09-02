<template>
  <v-container>
    <div class="d-flex align-center justify-space-between mb-4 flex-wrap ga-2">
      <h1>SpaceX Rockets</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="isDialogOpen = true">
        Add rocket
      </v-btn>
    </div>

    <RocketFilter v-model="filterText" />

    <AddRocketDialog v-model="isDialogOpen" @submit="handleAdd" />

    <StateLoading v-if="store.status === 'loading'" />

    <StateError
      v-else-if="store.status === 'error'"
      :message="store.errorMessage"
      @retry="store.fetchRockets"
    />

    <template v-else-if="store.status === 'success'">
      <p v-if="filteredRockets.length === 0" class="text-medium-emphasis">
        No rockets match "{{ filterText }}".
      </p>

      <v-row v-else>
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRocketStore } from '@/stores/rockets'
import type { Rocket } from '@/types/rocket'

const store = useRocketStore()
const filterText = ref('')
const isDialogOpen = ref(false)

onMounted(() => {
  store.fetchRockets()
})

const filteredRockets = computed(() => {
  const query = filterText.value.trim().toLowerCase()
  if (!query) return store.rockets
  return store.rockets.filter((rocket) => rocket.fullName.toLowerCase().includes(query))
})

function handleAdd(rocket: Omit<Rocket, 'id' | 'isLocal'>) {
  store.addLocalRocket(rocket)
  isDialogOpen.value = false
}
</script>

<template>
  <v-container class="py-8">
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Rockets</h1>
        <p class="text-body-1 text-medium-emphasis mt-2">
          Explore rockets from the Launch Library API.
        </p>
        <v-text-field
          v-model="searchQuery"
          label="Filter rockets"
          placeholder="Search by rocket name..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          class="mt-6"
          max-width="500"
        />
      </div>
      <AddRocketDialog @add="handleAddRocket" />
    </div>

    <div v-if="rocketStore.loading" class="d-flex justify-center py-12">
      <v-progress-circular
        indeterminate
        size="48"
      />
    </div>

    <v-alert
      v-else-if="rocketStore.error"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      {{ rocketStore.error }}

      <template #append>
        <v-btn
          variant="text"
          @click="rocketStore.fetchRockets"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketCard :rocket="rocket" @select="handleSelectRocket" />
      </v-col>
    </v-row>
    <v-alert
      v-if="!filteredRockets.length && !rocketStore.loading && !rocketStore.error"
      type="info"
      variant="tonal"
      class="mt-4"
    >
      No rockets found.
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import type { Rocket } from '@/types/rocket'
import RocketCard from '@/components/RocketCard.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'

const rocketStore = useRocketStore()
const router = useRouter()
const searchQuery = ref('')
const filteredRockets = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return rocketStore.rockets
  }

  return rocketStore.rockets.filter((rocket) =>
    rocket.full_name.toLowerCase().includes(query),
  )
})

onMounted(() => {
  rocketStore.fetchRockets()
})

function handleSelectRocket(id: number) {
  router.push(`/rockets/${id}`)
}

function handleAddRocket(rocket: Rocket) {
  rocketStore.addRocket(rocket)
}
</script>

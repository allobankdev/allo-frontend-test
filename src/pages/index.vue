<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import RocketCard from '@/components/RocketCard.vue'
import RocketFormDialog from '@/components/RocketFormDialog.vue'

import { useRockets } from '@/composable/useRockets'
import type { Rocket } from '@/services/spaceDevs'

const router = useRouter()

const {
  rockets,
  loading,
  error,
  fetchRockets,
  addRocket,
} = useRockets()

const search = ref('')
const showAddDialog = ref(false)

const filteredRockets = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) {
    return rockets.value
  }

  return rockets.value.filter((rocket) => {
    const name = rocket.name?.toLowerCase() || ''
    const fullName = rocket.full_name?.toLowerCase() || ''

    return (
      name.includes(keyword) ||
      fullName.includes(keyword)
    )
  })
})

const handleDetail = (id: string | number) => {
  router.push(`/rockets/${id}`)
}

const handleAddRocket = (rocket: Omit<Rocket, 'id'>) => {
  addRocket(rocket)
}

onMounted(() => {
  fetchRockets()
})
</script>

<template>
  <v-container class="py-8">
    <!-- HEADER -->
    <div
      class="d-flex flex-column flex-md-row align-md-center justify-space-between ga-4 mb-8"
    >
      <div>
        <h1 class="text-h4 font-weight-bold">
          SpaceX Rockets
        </h1>

        <p class="text-body-1 text-medium-emphasis mt-2">
          Explore SpaceX launcher configurations.
        </p>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="showAddDialog = true"
      >
        Add Rocket
      </v-btn>
    </div>

    <!-- SEARCH -->
    <v-text-field
      v-model="search"
      label="Search rocket"
      placeholder="Search by rocket name..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      class="mb-6"
    />

    <!-- LOADING -->
    <div
      v-if="loading"
      class="d-flex justify-center py-16"
    >
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="48"
        />

        <p class="mt-4 text-medium-emphasis">
          Loading rockets...
        </p>
      </div>
    </div>

    <!-- ERROR -->
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      <v-alert-title>
        Failed to load rockets
      </v-alert-title>

      {{ error }}

      <template #append>
        <v-btn
          variant="outlined"
          @click="fetchRockets(true)"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <!-- SUCCESS -->
    <template v-else>
      <div class="d-flex justify-space-between align-center mb-4">
        <span class="text-body-2 text-medium-emphasis">
          {{ filteredRockets.length }} rocket(s)
        </span>
      </div>

      <!-- EMPTY SEARCH -->
      <v-alert
        v-if="filteredRockets.length === 0"
        type="info"
        variant="tonal"
      >
        No rockets found.
      </v-alert>

      <!-- ROCKET LIST -->
      <v-row v-else>
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          lg="4"
          xl="3"
        >
          <RocketCard
            :rocket="rocket"
            @detail="handleDetail"
          />
        </v-col>
      </v-row>
    </template>

    <!-- ADD ROCKET -->
    <RocketFormDialog
      v-model="showAddDialog"
      @submit="handleAddRocket"
    />
  </v-container>
</template>
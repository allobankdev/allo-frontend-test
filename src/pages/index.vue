
<template>
  <v-container class="py-8">
    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h1 class="text-h3 font-weight-bold">
          Rocket Explorer
        </h1>

        <p class="text-body-1 text-medium-emphasis mt-2">
          Explore SpaceX launch vehicles
        </p>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="showAddRocketDialog = true"
      >
        Add Rocket
      </v-btn>
    </div>

    <v-text-field
      v-model="searchQuery"
      label="Search rockets"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
    />

      <!-- Loading state -->
      <v-row v-if="rocketStore.isLoading">
        <v-col
          v-for="n in 6"
          :key="n"
          cols="12"
          sm="6"
          md="4"
        >
          <v-skeleton-loader
            type="image, article"
            class="rounded"
          />
        </v-col>
      </v-row>

      <!-- Error state -->
      <v-alert
        v-else-if="rocketStore.errorMessage"
        type="error"
        variant="tonal"
        class="mb-6"
      >
        <v-alert-title>
          Something went wrong
        </v-alert-title>

        {{ rocketStore.errorMessage }}

        <template #append>
          <v-btn
            variant="outlined"
            @click="rocketStore.loadRockets"
          >
            Retry
          </v-btn>
        </template>
      </v-alert>

      <!-- Empty state -->
      <div
        v-else-if="filteredRockets.length === 0"
        class="text-center py-12"
      >
        <v-icon
          icon="mdi-rocket-off"
          size="64"
          class="mb-4"
        />

        <h2 class="text-h5">
          No rockets found
        </h2>

        <p class="text-body-2 text-medium-emphasis mt-2">
          Try searching with a different keyword.
        </p>
      </div>

      <!-- Success state -->
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
    <AddRocketDialog
      v-model="showAddRocketDialog"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRocketStore } from '@/stores/rockets'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import RocketCard from '@/components/RocketCard.vue'

const rocketStore = useRocketStore()
const searchQuery = ref('')
const showAddRocketDialog = ref(false)

const filteredRockets = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return rocketStore.rockets
  }

  return rocketStore.rockets.filter((rocket) => {
    const name = rocket.full_name?.toLowerCase() ?? ''
    const description = rocket.description?.toLowerCase() ?? ''

    return (
      name.includes(query) ||
      description.includes(query)
    )
  })
})

onMounted(() => {
  rocketStore.loadRockets()
})
</script>

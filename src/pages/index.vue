<template>
  <v-app-bar
    :elevation="2"
    color="primary"
  >
    <v-app-bar-title>SpaceX Rockets</v-app-bar-title>
    <template #append>
      <v-responsive
        max-width="320"
        class="mr-4 w-100"
      >
        <v-text-field
          :model-value="store.filterQuery"
          density="compact"
          label="Search Rockets"
          variant="solo"
          hide-details
          single-line
          append-inner-icon="mdi-magnify"
          @update:model-value="onFilterChange"
        />
      </v-responsive>
      <AddRocketDialog />
    </template>
  </v-app-bar>

  <v-main>
    <v-container>
      <div
        v-if="store.loading"
        class="d-flex justify-center align-center h-screen-50"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
      </div>

      <div
        v-else-if="store.error"
        class="d-flex flex-column justify-center align-center h-screen-50"
      >
        <v-icon
          icon="mdi-alert-circle"
          color="error"
          size="64"
          class="mb-4"
        />
        <div class="text-h6 text-error mb-4">
          {{ store.error }}
        </div>
        <v-btn
          color="primary"
          @click="store.fetchRockets"
        >
          Retry
        </v-btn>
      </div>

      <div
        v-else-if="store.filteredRockets.length === 0"
        class="d-flex justify-center align-center h-screen-50"
      >
        <div class="text-h6 text-grey">
          No rockets found
        </div>
      </div>

      <v-row v-else>
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <RocketCard
            :rocket="rocket"
            @click="goToDetail(rocket.id)"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import AddRocketDialog from '@/components/AddRocketDialog.vue'
import RocketCard from '@/components/RocketCard.vue'
import { useRocketStore } from '@/stores/rocketStore'

const store = useRocketStore()
const router = useRouter()

const onFilterChange = (value: string) => {
  store.setFilter(value)
}

const goToDetail = (id: string) => {
  router.push(`/rockets/${id}`)
}

onMounted(() => {
  if (store.rockets.length === 0) {
    store.fetchRockets()
  }
})
</script>

<style scoped>
.h-screen-50 {
  height: 50vh;
}
</style>

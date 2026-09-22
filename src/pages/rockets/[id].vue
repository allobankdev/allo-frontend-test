<template>
  <section>
    <router-link to="/" class="d-inline-flex align-center text-medium-emphasis text-decoration-none mb-6">
      <v-icon icon="mdi-arrow-left" size="18" class="mr-1" />
      Back to rockets
    </router-link>

    <LoadingState v-if="store.status === 'loading'" message="Loading rocket…" />

    <ErrorState
      v-else-if="store.status === 'error'"
      :message="store.errorMessage ?? 'Unknown error.'"
      @retry="store.loadRockets(true)"
    />

    <p v-else-if="!rocket" class="text-medium-emphasis text-center py-12">
      We couldn't find that rocket. It may have been removed from this session.
    </p>

    <v-row v-else>
      <v-col cols="12" md="6">
        <RocketImage :src="rocket.imageUrl" :alt="rocket.fullName" :aspect-ratio="4 / 3" class="rounded-lg" />
      </v-col>

      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold mb-3">{{ rocket.fullName }}</h1>
        <p class="text-medium-emphasis mb-6">
          {{ rocket.description || 'No description available for this rocket yet.' }}
        </p>

        <v-row dense>
          <v-col cols="6" sm="4">
            <div class="text-caption text-medium-emphasis">Cost per launch</div>
            <div class="text-h6 font-weight-medium">{{ formattedCost }}</div>
          </v-col>
          <v-col cols="6" sm="4">
            <div class="text-caption text-medium-emphasis">Country</div>
            <div class="text-h6 font-weight-medium">{{ rocket.countryCode || 'Unknown' }}</div>
          </v-col>
          <v-col cols="6" sm="4">
            <div class="text-caption text-medium-emphasis">First flight</div>
            <div class="text-h6 font-weight-medium">{{ rocket.maidenFlight || 'Unknown' }}</div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import RocketImage from '@/components/RocketImage.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute('/rockets/[id]')
const store = useRocketStore()

const rocket = computed(() => store.getById(route.params.id))

const formattedCost = computed(() => {
  const cost = rocket.value?.launchCost
  if (cost === null || cost === undefined) return 'Unknown'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cost)
})

onMounted(() => {
  // Handles a direct visit/refresh on the detail URL, where the list
  // hasn't been loaded into the store yet.
  store.loadRockets()
})
</script>

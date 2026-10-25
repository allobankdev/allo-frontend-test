<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilters from '@/components/RocketFilters.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'

const route = useRoute()
const router = useRouter()
const rocketStore = useRocketStore()

onMounted(() => {
  const search = route.query.search
  const country = route.query.country
  const sort = route.query.sort

  rocketStore.searchQuery = typeof search === 'string' ? search : ''
  rocketStore.countryFilter = typeof country === 'string' ? country : 'all'
  rocketStore.sortBy =
    sort === 'name-desc' ||
    sort === 'cost-high' ||
    sort === 'cost-low'
      ? sort
      : 'name-asc'

  if (!rocketStore.rockets.length) {
    rocketStore.fetchRockets()
  }
})

watch(
  () => [
    rocketStore.searchQuery,
    rocketStore.countryFilter,
    rocketStore.sortBy,
  ],
  ([search, country, sort]) => {
    router.replace({
      query: {
        ...(search ? { search } : {}),
        ...(country !== 'all' ? { country } : {}),
        ...(sort !== 'name-asc' ? { sort } : {}),
      },
    })
  },
)
</script>

<template>
  <v-container class="py-8">
    <div class="mb-8">
      <p class="text-overline text-primary mb-2">
        Allo Bank Frontend Test
      </p>

      <h1 class="text-h4 text-md-h3 font-weight-bold mb-3">
        SpaceX Rocket Explorer
      </h1>

      <p class="text-body-1 text-medium-emphasis mb-0">
        Explore SpaceX rockets from Launch Library 2, view their details,
        and add temporary rockets while the app is running.
      </p>
    </div>

    <LoadingState v-if="rocketStore.loading" />

    <ErrorState
      v-else-if="rocketStore.error"
      :message="rocketStore.error"
      @retry="rocketStore.fetchRockets"
    />

    <template v-else>
      <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between ga-4 mb-6">
        <div>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Showing {{ rocketStore.filteredRockets.length }} of
            {{ rocketStore.allRockets.length }} rocket(s)
          </p>
        </div>

        <AddRocketDialog @add="rocketStore.addRocket" />
      </div>

      <RocketFilters
        v-model:search-query="rocketStore.searchQuery"
        v-model:country-filter="rocketStore.countryFilter"
        v-model:sort-by="rocketStore.sortBy"
        :countries="rocketStore.countryOptions"
        @reset="rocketStore.resetFilters"
      />

      <v-row v-if="rocketStore.filteredRockets.length">
        <v-col
          v-for="rocket in rocketStore.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <EmptyState v-else />
    </template>
  </v-container>
</template>
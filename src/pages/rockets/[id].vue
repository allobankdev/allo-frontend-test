<template>
  <v-container max-width="900">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      to="/"
      class="mb-4"
    >
      Back to list
    </v-btn>

    <v-skeleton-loader
      v-if="isLoading"
      type="image, article, list-item-two-line"
    />

    <ErrorState
      v-else-if="store.detailStatus === 'error'"
      :message="store.detailError ?? 'Failed to load rocket'"
      @retry="load"
    />

    <v-card v-else-if="store.detail">
      <RocketImage
        :src="store.detail.imageUrl"
        :alt="store.detail.name"
        :height="320"
      />
      <v-card-title class="text-h5 text-wrap">
        {{ store.detail.name }}
      </v-card-title>
      <v-card-text>
        <p class="mb-4">
          {{ store.detail.description ?? 'No description available.' }}
        </p>
        <v-list lines="two">
          <v-list-item
            prepend-icon="mdi-cash"
            title="Cost per launch"
            :subtitle="formatCost(store.detail.launchCost)"
          />
          <v-list-item
            prepend-icon="mdi-earth"
            title="Country"
            :subtitle="formatCountry(store.detail.countryCode)"
          />
          <v-list-item
            prepend-icon="mdi-calendar"
            title="First flight"
            :subtitle="formatDate(store.detail.maidenFlight)"
          />
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useRocketStore } from '@/stores/rocket'
  import { formatCost, formatCountry, formatDate } from '@/utils/format'

  const route = useRoute('/rockets/[id]')
  const store = useRocketStore()

  const id = computed(() => route.params.id)
  const isLoading = computed(
    () => store.detailStatus === 'idle' || store.detailStatus === 'loading',
  )

  function load() {
    store.loadDetail(id.value)
  }

  watch(id, load, { immediate: true })
</script>
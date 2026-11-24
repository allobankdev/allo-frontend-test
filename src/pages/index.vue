<template>
  <v-container>
    <div class="d-flex flex-wrap align-center ga-3 mb-6">
      <h1 class="text-h4 flex-grow-1">
        SpaceX Rockets
      </h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="dialog = true"
      >
        Add rocket
      </v-btn>
    </div>

    <v-row class="mb-2">
      <v-col
        cols="12"
        sm="8"
      >
        <v-text-field
          v-model="store.searchQuery"
          label="Search by name or description"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
        />
      </v-col>
      <v-col
        cols="12"
        sm="4"
      >
        <v-select
          v-model="store.countryFilter"
          :items="countryItems"
          label="Country"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
        />
      </v-col>
    </v-row>

    <ErrorState
      v-if="store.listStatus === 'error'"
      class="my-4"
      :message="store.listError ?? 'Failed to load rockets'"
      @retry="store.loadRockets()"
    />

    <v-row v-if="showSkeleton">
      <v-col
        v-for="n in 8"
        :key="n"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-skeleton-loader type="image, article" />
      </v-col>
    </v-row>

    <v-row v-else-if="store.filteredRockets.length">
      <v-col
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <div
      v-else-if="store.listStatus === 'success'"
      class="text-center py-12"
    >
      <v-icon
        icon="mdi-rocket-launch-outline"
        size="64"
        class="mb-4"
      />
      <p class="text-h6 mb-4">
        No rockets match your filters
      </p>
      <v-btn
        variant="outlined"
        @click="store.resetFilters()"
      >
        Reset filters
      </v-btn>
    </div>

    <AddRocketDialog v-model="dialog" />
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRocketStore } from '@/stores/rocket'
  import { formatCountry } from '@/utils/format'

  const store = useRocketStore()
  const dialog = ref(false)

  const isLoading = computed(
    () => store.listStatus === 'idle' || store.listStatus === 'loading',
  )
  const showSkeleton = computed(() => isLoading.value && store.rockets.length === 0)
  const countryItems = computed(() =>
    store.countries.map((code) => ({ title: formatCountry(code), value: code })),
  )

  onMounted(() => {
    if (store.listStatus === 'idle') store.loadRockets()
  })
</script>
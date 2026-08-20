<!-- Rocket list screen: search, add, and the loading/error/success states. -->
<template>
  <v-container class="py-8">
    <div class="d-flex flex-wrap align-center ga-4 mb-6">
      <h1 class="text-h4 me-auto">
        Rockets
      </h1>
      <AddRocketDialog />
    </div>

    <v-text-field
      v-model="search"
      class="mb-6"
      clearable
      density="comfortable"
      hide-details
      label="Filter rockets by name or description"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
    />

    <StateView
      error-text="Couldn't load rockets from the SpaceX API."
      loading-text="Fetching rockets…"
      :status="status"
      @retry="store.fetchRockets"
    >
      <RocketList :rockets="filteredRockets" />
    </StateView>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import AddRocketDialog from '@/components/AddRocketDialog.vue'
  import RocketList from '@/components/RocketList.vue'
  import StateView from '@/components/StateView.vue'
  import { useRocketsStore } from '@/stores/rockets'

  const store = useRocketsStore()
  const { status, filteredRockets } = storeToRefs(store)

  // Two-way bridge to the store's searchQuery so the getter stays the single source.
  const search = computed({
    get: () => store.searchQuery,
    set: value => { store.searchQuery = value ?? '' },
  })

  onMounted(() => {
    store.loadCustomRockets()
    if (store.status !== 'success') {
      store.fetchRockets()
    }
  })
</script>

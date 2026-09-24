<template>
  <v-container>
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-4">
      <h1 class="text-h4">
        SpaceX Rockets
      </h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="isAddDialogOpen = true"
      >
        Add rocket
      </v-btn>
    </div>

    <RocketFilter
      v-model="search"
      class="mb-6"
    />

    <LoadingState
      v-if="isLoading"
      message="Loading rockets…"
    />

    <ErrorState
      v-else-if="rocketsStore.status === 'error'"
      :message="rocketsStore.errorMessage ?? 'The rockets could not be loaded.'"
      title="Could not load rockets"
      @retry="rocketsStore.fetchRockets()"
    />

    <EmptyState
      v-else-if="rocketsStore.rockets.length === 0"
      title="No rockets available"
    />

    <EmptyState
      v-else-if="filteredRockets.length === 0"
      :message="`No rocket names match “${searchQuery}”.`"
      title="No matching rockets"
    >
      <v-btn @click="search = ''">
        Clear search
      </v-btn>
    </EmptyState>

    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        md="4"
        sm="6"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <AddRocketDialog
      v-model="isAddDialogOpen"
      @create="addRocket"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRocketsStore } from '@/stores/rockets'
  import type { NewRocketInput } from '@/types/rocket'

  const rocketsStore = useRocketsStore()

  // UI-only state stays in the page; the rockets themselves live in the store.
  const search = ref<string | null>('')
  const isAddDialogOpen = ref(false)

  // 'idle' counts as loading so nothing flashes before the request starts.
  const isLoading = computed(() => rocketsStore.status === 'idle' || rocketsStore.status === 'loading')

  const searchQuery = computed(() => search.value?.trim() ?? '')

  const filteredRockets = computed(() => {
    const query = searchQuery.value.toLowerCase()
    return rocketsStore.rockets.filter(rocket => rocket.name.toLowerCase().includes(query))
  })

  function addRocket (input: NewRocketInput) {
    rocketsStore.addRocket(input)
    // Clear the search so the new rocket is visible straight away.
    search.value = ''
  }

  // The store skips the request when rockets are already loaded (e.g. coming back from a detail page).
  onMounted(() => {
    rocketsStore.fetchRockets()
  })
</script>

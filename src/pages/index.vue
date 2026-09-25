<template>
  <div>
    <section class="hero border-b">
      <v-container class="py-10 py-md-14">
        <div class="d-flex flex-wrap align-end justify-space-between ga-6">
          <div>
            <v-chip
              class="mb-4"
              color="primary"
              prepend-icon="mdi-satellite-variant"
              size="small"
              variant="tonal"
            >
              Launch Library 2 · The Space Devs
            </v-chip>
            <h1 class="text-h4 text-md-h3 font-weight-bold">
              SpaceX Rockets
            </h1>
            <p class="text-body-1 text-medium-emphasis mt-2">
              Explore every SpaceX launch vehicle, from Falcon 1 to Starship.
            </p>
          </div>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            size="large"
            @click="isAddDialogOpen = true"
          >
            Add rocket
          </v-btn>
        </div>

        <RocketFilterBar
          v-model:country="store.filters.country"
          v-model:search="store.filters.search"
          class="mt-8"
          :countries="store.countries"
        />
      </v-container>
    </section>

    <v-container class="py-8">
      <v-row v-if="store.status === 'loading' || store.status === 'idle'">
        <v-col
          v-for="n in SKELETON_COUNT"
          :key="n"
          cols="12"
          lg="4"
          sm="6"
        >
          <RocketCardSkeleton />
        </v-col>
      </v-row>

      <ErrorState
        v-else-if="store.status === 'error'"
        icon="mdi-cloud-off-outline"
        :message="store.error ?? 'Failed to load rockets.'"
        title="Couldn't load rockets"
        @retry="store.loadRockets({ force: true })"
      />

      <template v-else>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Showing <strong class="text-high-emphasis">{{ store.filteredRockets.length }}</strong>
          of {{ store.rockets.length }} rockets
        </p>

        <v-row v-if="store.filteredRockets.length">
          <v-col
            v-for="rocket in store.filteredRockets"
            :key="rocket.id"
            cols="12"
            lg="4"
            sm="6"
          >
            <RocketCard :rocket="rocket" />
          </v-col>
        </v-row>

        <StatusMessage
          v-else
          icon="mdi-magnify-close"
          message="Try a different search term or country."
          title="No rockets found"
        >
          <template #actions>
            <v-btn
              v-if="store.hasActiveFilters"
              color="primary"
              variant="tonal"
              @click="store.resetFilters()"
            >
              Clear filters
            </v-btn>
          </template>
        </StatusMessage>
      </template>
    </v-container>

    <AddRocketDialog
      v-model="isAddDialogOpen"
      :countries="store.countries"
      @submit="onAddRocket"
    />

    <v-snackbar
      v-model="isAddedSnackbarOpen"
      color="success"
      rounded="lg"
      timeout="3000"
    >
      <v-icon
        class="me-2"
        icon="mdi-check-circle-outline"
      />
      Rocket added to the list.
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import AddRocketDialog from '@/components/AddRocketDialog.vue'
  import ErrorState from '@/components/ErrorState.vue'
  import RocketCard from '@/components/RocketCard.vue'
  import RocketCardSkeleton from '@/components/RocketCardSkeleton.vue'
  import RocketFilterBar from '@/components/RocketFilterBar.vue'
  import StatusMessage from '@/components/StatusMessage.vue'
  import { useRocketStore } from '@/stores/rockets'
  import type { NewRocketInput } from '@/types/rocket'

  const SKELETON_COUNT = 6

  const store = useRocketStore()

  const isAddDialogOpen = ref(false)
  const isAddedSnackbarOpen = ref(false)

  function onAddRocket (input: NewRocketInput) {
    store.addRocket(input)
    isAddedSnackbarOpen.value = true
  }

  onMounted(() => {
    store.loadRockets()
  })

  onBeforeUnmount(() => {
    store.cancelLoad()
  })
</script>

<style scoped>
.hero {
  background:
    radial-gradient(circle at 85% 0%, rgba(var(--v-theme-primary), 0.08), transparent 45%),
    rgb(var(--v-theme-surface-light));
}
</style>

<template>
  <v-container
    fluid
    class="py-6 px-4 px-sm-6"
  >
    <RocketFilterBar />

    <div
      v-if="rocketsStore.loading"
      class="d-flex justify-center py-12"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      />
    </div>

    <v-alert
      v-else-if="rocketsStore.error"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      Failed to load rockets.
      <template #append>
        <v-btn
          variant="text"
          color="error"
          @click="rocketsStore.fetchRockets"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <template v-else>
      <v-row v-if="filteredRockets.length">
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="d-flex"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
      <v-empty-state
        v-else
        icon="mdi-rocket-launch-outline"
        title="No rockets found"
        text="Try adjusting your search or filters."
      />
    </template>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useRocketsStore } from '@/stores/rockets'
  import { useRocketFilters } from '@/composables/useRocketFilters'

  const rocketsStore = useRocketsStore()
  const { filteredRockets } = useRocketFilters()

  onMounted(() => {
    rocketsStore.fetchRockets()
  })
</script>

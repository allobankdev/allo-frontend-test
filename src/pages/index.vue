<template>
  <section>
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">
          SpaceX Rockets
        </h1>
        <p
          v-if="store.listStatus === 'success'"
          class="text-body-2 text-medium-emphasis"
        >
          Showing {{ store.filteredRockets.length }} of {{ store.rockets.length }} rockets
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="dialogOpen = true"
      >
        Add rocket
      </v-btn>
    </div>

    <RocketFilterBar
      v-model:active="store.filters.active"
      v-model:search="store.filters.search"
      class="mb-4"
    />

    <AsyncState
      :error="store.listError"
      loading-text="Loading rockets..."
      :status="store.listStatus"
      @retry="store.loadRockets"
    >
      <v-row v-if="store.filteredRockets.length">
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <div
        v-else
        class="empty text-medium-emphasis"
      >
        <v-icon
          icon="mdi-magnify-close"
          size="36"
        />
        <p>No rockets match your filters.</p>
        <v-btn
          variant="outlined"
          @click="store.resetFilters"
        >
          Clear filters
        </v-btn>
      </div>
    </AsyncState>

    <RocketFormDialog
      v-model="dialogOpen"
      @submit="store.addRocket"
    />
  </section>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useRocketStore } from '@/stores/rockets'

  const store = useRocketStore()
  const dialogOpen = ref(false)

  onMounted(() => {
    if (store.listStatus !== 'success') store.loadRockets()
  })
</script>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 64px 16px;
}

.empty p {
  margin: 0;
}
</style>

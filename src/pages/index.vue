<template>
  <v-container class="py-8">
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <h1 class="text-h4">
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

    <RocketFilter
      v-model="store.filter"
      class="mb-6"
      :countries="store.countries"
    />

    <AsyncState
      :error="store.error"
      loading-text="Loading rockets..."
      :status="store.status"
      @retry="store.loadRockets(true)"
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
        class="text-center py-12 text-medium-emphasis"
      >
        <v-icon
          icon="mdi-rocket-outline"
          size="48"
        />
        <p class="mt-2">
          No rockets match your filter.
        </p>
        <v-btn
          class="mt-2"
          variant="text"
          @click="store.resetFilter()"
        >
          Reset filter
        </v-btn>
      </div>
    </AsyncState>

    <AddRocketDialog
      v-model="dialog"
      @submit="store.addRocket"
    />
  </v-container>
</template>

<script lang="ts" setup>
  //
  import { onMounted, ref } from 'vue'
  import { useRocketStore } from '@/stores/rocket'

  const store = useRocketStore()
  const dialog = ref(false)

  onMounted(() => {
    store.loadRockets()
  })
</script>

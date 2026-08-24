<template>
  <v-container class="py-8 py-md-12">
    <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center ga-4 mb-8">
      <div>
        <h1 class="text-h3 font-weight-bold">
          SpaceX rockets
        </h1>
        <p class="text-medium-emphasis mt-2 mb-0">
          Explore every SpaceX launcher configuration.
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

    <template v-if="store.status === 'loading'">
      <div class="d-flex flex-column align-center py-16 ga-4">
        <v-progress-circular
          indeterminate
          color="primary"
          size="48"
        />
        <span class="text-medium-emphasis">Loading rockets…</span>
      </div>
    </template>

    <v-alert
      v-else-if="store.status === 'error'"
      type="error"
      variant="tonal"
      class="mx-auto"
      max-width="640"
    >
      <template #title>
        Unable to load rockets
      </template>
      {{ store.error }}
      <div class="mt-4">
        <v-btn
          color="error"
          variant="flat"
          @click="store.fetchRockets"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <template v-else>
      <RocketFilter
        v-model="query"
        :count="filteredRockets.length"
      />
      <v-row class="mt-2">
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
      <v-empty-state
        v-if="!filteredRockets.length"
        icon="mdi-rocket-outline"
        title="No rockets found"
        text="Try a different name or description."
      />
    </template>

    <AddRocketDialog
      v-model="dialogOpen"
      @add="store.addRocket"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRocketStore } from '@/stores/rockets'

  const store = useRocketStore()
  const query = ref('')
  const dialogOpen = ref(false)

  const filteredRockets = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return store.rockets
    return store.rockets.filter(rocket =>
      `${rocket.full_name} ${rocket.description}`.toLowerCase().includes(term),
    )
  })

  onMounted(() => store.fetchRockets())
</script>

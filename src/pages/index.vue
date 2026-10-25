<template>
  <v-container
    class="py-6 py-md-12"
    max-width="1200"
  >
    <div class="page-header mb-6 mb-md-8">
      <h1 class="display-heading text-h4 text-md-h3 font-weight-medium">
        SpaceX
      </h1>
      <AddRocketDialog />
    </div>

    <LoadingState v-if="store.status === 'loading'" />

    <ErrorState
      v-else-if="store.status === 'error'"
      :message="store.errorMessage"
      @retry="store.fetchRockets"
    />

    <template v-else>
      <RocketFilter
        v-model="search"
        class="mb-6 mb-md-8 filter-field"
      />

      <p
        v-if="filteredRockets.length === 0"
        class="text-body-2"
        style="color: var(--color-ink-soft);"
      >
        No rockets match "{{ search }}".
      </p>

      <v-row v-else>
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
    </template>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRocketsStore } from '@/stores/rockets'

  const store = useRocketsStore()
  const search = ref('')

  const filteredRockets = computed(() => {
    const query = search.value.trim().toLowerCase()
    if (!query) return store.rockets

    return store.rockets.filter(rocket => rocket.full_name.toLowerCase().includes(query))
  })

  onMounted(() => {
    if (store.status === 'idle') {
      store.fetchRockets()
    }
  })
</script>

<style scoped>
.page-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.filter-field {
  max-width: 100%;
}

@media (min-width: 600px) {
  .page-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .filter-field {
    max-width: 360px;
  }
}
</style>

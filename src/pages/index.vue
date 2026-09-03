<template>
  <v-container>
    <div class="d-flex align-start justify-space-between flex-wrap ga-4 mb-6">
      <div>
        <h1 class="u-fluid-h5 font-weight-bold">
          Rocket List
        </h1>
        <p class="text-body-2 text-on-surface-variant mt-1">
          {{ store.rockets.length }} launch vehicles
        </p>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-plus"
        :size="mobile ? 'small' : 'default'"
        @click="isDialogOpen = true"
      >
        Add rocket
      </v-btn>
    </div>

    <RocketFilter
      v-model="filter"
      :families="store.families"
    />

    <AddRocketDialog
      v-model="isDialogOpen"
      @submit="handleAdd"
    />

    <StateLoading v-if="store.status === 'loading'" />

    <StateError
      v-else-if="store.status === 'error'"
      :message="store.errorMessage"
      @retry="store.fetchRockets"
    />

    <template v-else-if="store.status === 'success'">
      <p
        v-if="filteredRockets.length === 0"
        class="text-body-2 text-on-surface-variant"
      >
        No rockets match your filters.
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

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useRocketStore } from '@/stores/rockets'
import type { Rocket } from '@/types/rocket'
import type { RocketFilterValue } from '@/components/RocketFilter.vue'

const store = useRocketStore()
const isDialogOpen = ref(false)
const { mobile } = useDisplay()

const filter = ref<RocketFilterValue>({
  query: '',
  families: [],
  activeOnly: false,
})

onMounted(() => {
  if (store.rockets.length === 0) {
    store.fetchRockets()
  }
})

const filteredRockets = computed(() => {
  const query = filter.value.query.trim().toLowerCase()

  return store.rockets.filter((rocket) => {
    const matchesQuery = !query || rocket.fullName.toLowerCase().includes(query)
    const matchesFamily = filter.value.families.length === 0 ||
      (rocket.family !== null && filter.value.families.includes(rocket.family))
    const matchesActive = !filter.value.activeOnly || rocket.active
    return matchesQuery && matchesFamily && matchesActive
  })
})

function handleAdd(rocket: Omit<Rocket, 'id' | 'isLocal'>) {
  store.addLocalRocket(rocket)
  isDialogOpen.value = false
}
</script>
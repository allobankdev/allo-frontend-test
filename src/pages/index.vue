<template>
  <v-container class="py-6">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center flex-wrap gap-4 mb-6">
          <h1 class="text-h4 font-weight-bold">
            Rockets
          </h1>
          <v-spacer />
          <v-text-field
            v-model="filterQuery"
            placeholder="Filter by name, description, country..."
            density="comfortable"
            variant="outlined"
            hide-details
            clearable
            class="filter-field"
            style="max-width: 320px;"
          >
            <template #prepend-inner>
              <v-icon size="small">
                mdi-magnify
              </v-icon>
            </template>
          </v-text-field>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="showAddDialog = true"
          >
            Add rocket
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <UiStateLoading
      v-if="store.loading"
      message="Loading rockets..."
    />
    <UiStateError
      v-else-if="store.error"
      :message="store.error"
      @retry="store.loadRockets()"
    />
    <v-row
      v-else
      class="rocket-grid"
    >
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
      <v-col
        v-if="store.filteredRockets.length === 0"
        cols="12"
        class="text-center text-medium-emphasis py-16"
      >
        No rockets match your filter.
      </v-col>
    </v-row>

    <AddRocketDialog
      v-model="showAddDialog"
      @add="onAddRocket"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRocketsStore } from '@/stores/rockets'
import UiStateLoading from '@/components/UiStateLoading.vue'
import UiStateError from '@/components/UiStateError.vue'
import RocketCard from '@/components/RocketCard.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'

const store = useRocketsStore()
const showAddDialog = ref(false)

const filterQuery = computed({
  get: () => store.filterQuery,
  set: (v) => store.setFilter(v ?? ''),
})

function onAddRocket(input: import('@/types/rocket').RocketInput) {
  store.addRocket(input)
}

onMounted(() => {
  if (store.rockets.length === 0 && !store.loading) {
    store.loadRockets()
  }
})
</script>

<style scoped>
.rocket-grid {
  min-height: 200px;
}
@media (min-width: 600px) {
  .filter-field {
    min-width: 280px;
  }
}
</style>

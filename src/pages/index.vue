<template>
  <v-container class="py-6">
    <div class="d-flex align-center justify-space-between flex-wrap mb-4">
      <div>
        <h1 class="text-h4">
          SpaceX Rockets
        </h1>
        <p class="text-body-2 text-medium-emphasis">
          Launch Library 2 · detailed SpaceX launchers
        </p>
      </div>
    </div>

    <StateLoading
      v-if="store.status === 'loading'"
      message="Loading rockets…"
    />
    <StateError
      v-else-if="store.status === 'error'"
      :message="store.error ?? 'Something went wrong while fetching data. Please try again.'"
      @retry="store.retry()"
    />
    <template v-else>
      <SearchFilterBar
        :search="store.search"
        :family="store.familyFilter"
        :status="store.statusFilter"
        :families="store.families"
        @update:search="store.search = $event"
        @update:family="store.familyFilter = $event"
        @update:status="store.statusFilter = $event"
        @open-add="dialog = true"
      />

      <EmptyState
        v-if="store.filtered.length === 0"
        title="No rockets found"
        message="Try adjusting your search or filters."
      >
        <v-btn
          v-if="hasActiveFilters"
          class="mt-4"
          variant="outlined"
          @click="store.resetFilters()"
        >
          Clear filters
        </v-btn>
      </EmptyState>
      <RocketGrid
        v-else
        :rockets="store.filtered"
      />

      <AddRocketDialog
        v-model="dialog"
        @submit="onAdd"
      />
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import EmptyState from '@/components/EmptyState.vue'
import RocketGrid from '@/components/RocketGrid.vue'
import SearchFilterBar from '@/components/SearchFilterBar.vue'
import StateError from '@/components/StateError.vue'
import StateLoading from '@/components/StateLoading.vue'
import { useRocketsStore } from '@/stores/rockets'
import type { LocalRocketInput } from '@/types/rocket'

const store = useRocketsStore()
const dialog = ref(false)

const hasActiveFilters = computed(
  () => store.search !== '' || store.familyFilter !== 'all' || store.statusFilter !== 'all',
)

function onAdd (input: LocalRocketInput) {
  store.addLocal(input)
}

onMounted(() => {
  void store.loadAll()
})
</script>

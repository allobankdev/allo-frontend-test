<template>
  <div
    class="filter-panel p-3 mb-6 bg-surface border rounded-sm"
    style="border-color: var(--titanium-border);"
  >
    <v-row
      align="center"
      dense
    >
      <!-- Search input -->
      <v-col
        cols="12"
        md="5"
        lg="5"
      >
        <v-text-field
          v-model="store.searchQuery"
          density="comfortable"
          variant="outlined"
          color="primary"
          placeholder="Search by vehicle name, family, description..."
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          class="bg-surface-variant font-mono"
          style="font-size: 0.9rem;"
        />
      </v-col>

      <!-- Family Filter Badges -->
      <v-col
        cols="12"
        md="7"
        lg="7"
        class="d-flex align-center justify-md-end flex-wrap ga-2 pt-2 pt-md-0"
      >
        <span
          class="font-mono text-caption text-secondary me-1"
          style="font-size: 0.72rem; letter-spacing: 0.5px;"
        >
          Family:
        </span>
        <v-chip-group
          v-model="store.selectedFamily"
          selected-class="text-primary font-weight-bold"
          mandatory
        >
          <v-chip
            value="all"
            filter
            variant="tonal"
            size="small"
            rounded="sm"
            class="font-mono"
          >
            All Hardware
          </v-chip>
          <v-chip
            v-for="family in store.rocketFamilies"
            :key="family"
            :value="family"
            filter
            variant="tonal"
            size="small"
            rounded="sm"
            class="font-mono"
          >
            {{ family }}
          </v-chip>
        </v-chip-group>

        <!-- Active Reset Action -->
        <v-btn
          v-if="isFiltered"
          variant="text"
          color="secondary"
          size="small"
          prepend-icon="mdi-filter-remove-outline"
          class="text-none font-weight-medium"
          @click="store.clearFilters"
        >
          Reset Filters
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'

const store = useRocketStore()

const isFiltered = computed(() => {
  return store.searchQuery.trim().length > 0 || store.selectedFamily !== 'all'
})
</script>

<style scoped>
.filter-panel {
  background-color: var(--console-surface) !important;
}

:deep(.v-field__outline) {
  --v-field-border-opacity: 0.15;
}
</style>

<template>
  <div
    class="filter-panel pa-3 mb-6 bg-surface border rounded-sm"
    style="border-color: var(--titanium-border);"
  >
    <v-row
      align="center"
      dense
    >
      <!-- Search input with High-Contrast Accessibility -->
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
          class="search-input font-mono"
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
          class="font-mono text-caption text-high-emphasis font-weight-medium me-1"
          style="font-size: 0.76rem; letter-spacing: 0.5px; color: #cbd5e1 !important;"
        >
          Family:
        </span>
        <v-chip-group
          v-model="store.selectedFamily"
          selected-class="chip-active font-weight-bold"
          mandatory
        >
          <v-chip
            value="all"
            filter
            variant="tonal"
            size="small"
            rounded="sm"
            class="font-mono family-chip"
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
            class="font-mono family-chip"
          >
            {{ family }}
          </v-chip>
        </v-chip-group>

        <!-- Active Reset Action -->
        <v-btn
          v-if="isFiltered"
          variant="text"
          color="primary"
          size="small"
          prepend-icon="mdi-filter-remove-outline"
          class="text-none font-weight-bold"
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

/* High-Contrast Search Field Styling */
:deep(.v-field) {
  background-color: #0b111e !important;
  border-radius: 4px;
}

:deep(.v-field__outline) {
  --v-field-border-opacity: 0.45 !important;
  color: #475569 !important;
}

:deep(.v-field--focused .v-field__outline) {
  --v-field-border-opacity: 1 !important;
  color: #38bdf8 !important;
}

:deep(.v-field__input) {
  color: #f8fafc !important;
  font-size: 0.92rem !important;
}

:deep(input::placeholder) {
  color: #94a3b8 !important;
  opacity: 1 !important;
  font-weight: 400;
}

:deep(.v-field__prepend-inner .v-icon) {
  color: #38bdf8 !important;
  opacity: 1 !important;
}

:deep(.v-field__clearable .v-icon) {
  color: #94a3b8 !important;
  opacity: 0.8 !important;
}

/* Family Chips High Contrast */
.family-chip {
  color: #cbd5e1 !important;
  border: 1px solid rgba(148, 163, 184, 0.25) !important;
  background-color: rgba(15, 23, 42, 0.6) !important;
}

.family-chip:hover {
  border-color: rgba(56, 189, 248, 0.5) !important;
  color: #f8fafc !important;
}

.chip-active {
  background-color: rgba(56, 189, 248, 0.15) !important;
  border-color: #38bdf8 !important;
  color: #38bdf8 !important;
}
</style>

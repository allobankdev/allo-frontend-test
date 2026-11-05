<template>
  <div class="filter-container mb-6">
    <v-row
      align="center"
      dense
    >
      <!-- Search input -->
      <v-col
        cols="12"
        md="6"
        lg="5"
      >
        <v-text-field
          v-model="store.searchQuery"
          density="comfortable"
          variant="outlined"
          color="primary"
          placeholder="Search by rocket name, family, description..."
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          class="bg-surface rounded-lg"
          style="border-color: rgba(255, 255, 255, 0.08);"
        />
      </v-col>

      <!-- Family chips -->
      <v-col
        cols="12"
        md="6"
        lg="7"
        class="d-flex align-center justify-md-end flex-wrap ga-2 pt-2 pt-md-0"
      >
        <span
          class="text-caption text-secondary font-weight-medium me-1 text-uppercase"
          style="letter-spacing: 0.5px;"
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
          >
            All Vehicles
          </v-chip>
          <v-chip
            v-for="family in store.rocketFamilies"
            :key="family"
            :value="family"
            filter
            variant="tonal"
            size="small"
            rounded="sm"
          >
            {{ family }}
          </v-chip>
        </v-chip-group>

        <!-- Reset Button -->
        <v-btn
          v-if="isFiltered"
          variant="text"
          color="secondary"
          size="small"
          prepend-icon="mdi-filter-remove-outline"
          class="text-none"
          @click="store.clearFilters"
        >
          Reset
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
:deep(.v-field__outline) {
  --v-field-border-opacity: 0.15;
}
</style>

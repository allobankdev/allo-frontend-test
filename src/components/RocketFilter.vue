<template>
  <v-card
    class="pa-4 rounded-xl mb-6 bg-allo-card border-subtle"
    elevation="2"
  >
    <v-row
      align="center"
      dense
    >
      <!-- Search Input -->
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Filter by rocket name, description, country..."
          label="Search Rockets"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
          color="#ffbc25"
          @update:model-value="onSearchUpdate"
        />
      </v-col>

      <!-- Category Filter Chips -->
      <v-col
        cols="12"
        md="6"
        class="d-flex align-center justify-start justify-md-end flex-wrap ga-2 mt-2 mt-md-0"
      >
        <span class="text-caption text-grey-lighten-1 mr-1">Filter:</span>
        <v-chip-group
          v-model="filterSelection"
          mandatory
          selected-class="text-allo-yellow font-weight-bold"
          @update:model-value="onFilterUpdate"
        >
          <v-chip
            value="all"
            variant="tonal"
            size="small"
            filter
            color="#ffbc25"
          >
            All ({{ totalCount }})
          </v-chip>
          <v-chip
            value="active"
            variant="tonal"
            size="small"
            filter
            color="#17a16e"
          >
            Active
          </v-chip>
          <v-chip
            value="reusable"
            variant="tonal"
            size="small"
            filter
            color="#216ba5"
          >
            Reusable
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <!-- Results feedback bar -->
    <div class="d-flex align-center justify-space-between mt-3 pt-2 border-t border-grey-darken-3">
      <span class="text-caption text-grey">
        Showing <strong class="text-white">{{ filteredCount }}</strong> of {{ totalCount }} rockets
      </span>
      <v-btn
        v-if="hasActiveFilter"
        variant="text"
        size="x-small"
        color="#ffbc25"
        prepend-icon="mdi-close"
        @click="resetFilters"
      >
        Clear filters
      </v-btn>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

defineProps<{
  totalCount: number
  filteredCount: number
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:filter', value: 'all' | 'active' | 'reusable'): void
}>()

const search = ref('')
const filterSelection = ref<'all' | 'active' | 'reusable'>('all')

const hasActiveFilter = computed(() => {
  return search.value.trim().length > 0 || filterSelection.value !== 'all'
})

function onSearchUpdate(val: string) {
  emit('update:search', val || '')
}

function onFilterUpdate(val: 'all' | 'active' | 'reusable') {
  emit('update:filter', val || 'all')
}

function resetFilters() {
  search.value = ''
  filterSelection.value = 'all'
  emit('update:search', '')
  emit('update:filter', 'all')
}
</script>

<style scoped>
.bg-allo-card {
  background-color: #131c2e !important;
}
.border-subtle {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.text-allo-yellow {
  color: #ffbc25 !important;
}
.border-t {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
</style>

<template>
  <div class="rocket-filter-container p-4 mb-6">
    <v-row
      dense
      align="center"
    >
      <!-- Search Input -->
      <v-col
        cols="12"
        md="5"
      >
        <v-text-field
          v-model="searchQuery"
          placeholder="Cari roket (nama, keluarga, deskripsi)..."
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          variant="outlined"
          density="comfortable"
          class="custom-search-input"
          @update:model-value="onSearchInput"
        />
      </v-col>

      <!-- Status Filter -->
      <v-col
        cols="6"
        sm="4"
        md="2"
      >
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          item-title="label"
          item-value="value"
          label="Status"
          variant="outlined"
          density="comfortable"
          hide-details
          class="custom-select"
          @update:model-value="onStatusChange"
        />
      </v-col>

      <!-- Reusable Filter -->
      <v-col
        cols="6"
        sm="4"
        md="2"
      >
        <v-select
          v-model="reusableFilter"
          :items="reusableOptions"
          item-title="label"
          item-value="value"
          label="Reusabilitas"
          variant="outlined"
          density="comfortable"
          hide-details
          class="custom-select"
          @update:model-value="onReusableChange"
        />
      </v-col>

      <!-- Sort By -->
      <v-col
        cols="12"
        sm="4"
        md="3"
      >
        <v-select
          v-model="sortBy"
          :items="sortOptions"
          item-title="label"
          item-value="value"
          label="Urutkan"
          variant="outlined"
          density="comfortable"
          hide-details
          class="custom-select"
          @update:model-value="onSortChange"
        />
      </v-col>
    </v-row>

    <!-- Active Filters & Result Count Row -->
    <div class="d-flex flex-wrap align-center justify-space-between pt-3 mt-3 border-t text-caption">
      <div class="d-flex align-center gap-2">
        <span class="text-grey-lighten-1">
          Menampilkan <strong class="text-white">{{ filteredCount }}</strong> dari {{ totalCount }} roket
        </span>

        <v-chip
          v-if="hasActiveFilters"
          size="x-small"
          variant="text"
          class="text-grey px-1 cursor-pointer font-weight-medium"
          @click="resetAll"
        >
          <v-icon
            start
            size="14"
            icon="mdi-refresh"
          />
          Reset Filter
        </v-chip>
      </div>

      <!-- Quick Filter Chips -->
      <div class="d-none d-sm-flex align-center gap-1">
        <v-chip
          size="small"
          :variant="statusFilter === 'all' ? 'flat' : 'outlined'"
          :color="statusFilter === 'all' ? 'white' : 'grey'"
          :class="statusFilter === 'all' ? 'text-black font-weight-bold' : 'text-grey-lighten-2'"
          @click="quickSetStatus('all')"
        >
          Semua
        </v-chip>
        <v-chip
          size="small"
          :variant="statusFilter === 'active' ? 'flat' : 'outlined'"
          :color="statusFilter === 'active' ? 'white' : 'grey'"
          :class="statusFilter === 'active' ? 'text-black font-weight-bold' : 'text-grey-lighten-2'"
          @click="quickSetStatus('active')"
        >
          Aktif
        </v-chip>
        <v-chip
          size="small"
          :variant="statusFilter === 'retired' ? 'flat' : 'outlined'"
          :color="statusFilter === 'retired' ? 'white' : 'grey'"
          :class="statusFilter === 'retired' ? 'text-black font-weight-bold' : 'text-grey-lighten-2'"
          @click="quickSetStatus('retired')"
        >
          Pensiun
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRocketStore } from '@/stores/rockets'

const store = useRocketStore()

const searchQuery = computed({
  get: () => store.searchQuery,
  set: (val) => store.setSearchQuery(val || '')
})

const statusFilter = computed({
  get: () => store.statusFilter,
  set: (val) => store.setStatusFilter(val)
})

const reusableFilter = computed({
  get: () => store.reusableFilter,
  set: (val) => store.setReusableFilter(val)
})

const sortBy = computed({
  get: () => store.sortBy,
  set: (val) => store.setSortBy(val)
})

const totalCount = computed(() => store.totalCount)
const filteredCount = computed(() => store.filteredCount)

const hasActiveFilters = computed(() => {
  return (
    store.searchQuery.trim() !== '' ||
    store.statusFilter !== 'all' ||
    store.reusableFilter !== 'all' ||
    store.sortBy !== 'name-asc'
  )
})

const statusOptions = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Aktif', value: 'active' },
  { label: 'Pensiun', value: 'retired' }
]

const reusableOptions = [
  { label: 'Semua Tipe', value: 'all' },
  { label: 'Reusable', value: 'reusable' },
  { label: 'Expendable', value: 'expendable' }
]

const sortOptions = [
  { label: 'Nama (A-Z)', value: 'name-asc' },
  { label: 'Nama (Z-A)', value: 'name-desc' },
  { label: 'Biaya (Termurah)', value: 'cost-asc' },
  { label: 'Biaya (Termahal)', value: 'cost-desc' },
  { label: 'Penerbangan Terbaru', value: 'flight-desc' }
]

function onSearchInput(val: string) {
  store.setSearchQuery(val || '')
}

function onStatusChange(val: 'all' | 'active' | 'retired') {
  store.setStatusFilter(val)
}

function onReusableChange(val: 'all' | 'reusable' | 'expendable') {
  store.setReusableFilter(val)
}

function onSortChange(val: 'name-asc' | 'name-desc' | 'cost-asc' | 'cost-desc' | 'flight-desc') {
  store.setSortBy(val)
}

function quickSetStatus(val: 'all' | 'active' | 'retired') {
  store.setStatusFilter(val)
}

function resetAll() {
  store.resetFilters()
}
</script>

<style scoped>
.rocket-filter-container {
  background-color: #121214;
  border: 1px solid #27272a;
  border-radius: 8px;
  padding: 1.25rem;
}

.border-t {
  border-top: 1px solid #27272a;
}

.gap-1 {
  gap: 0.35rem;
}

.gap-2 {
  gap: 0.75rem;
}
</style>

<template>
  <div class="rocket-filter-bar">
    <!-- Desktop -->
    <v-row
      align="center"
      dense
      class="d-none d-md-flex"
    >
      <v-col cols="5">
        <v-text-field
          v-model="store.searchQuery"
          clearable
          density="comfortable"
          hide-details
          label="Search rockets by name"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
      </v-col>

      <v-col cols="4">
        <v-select
          v-model="store.sortBy"
          density="comfortable"
          hide-details
          :items="sortOptions"
          label="Sort by"
          variant="outlined"
        />
      </v-col>

      <v-col
        cols="3"
        class="d-flex justify-end"
      >
        <v-switch
          v-model="store.activeOnly"
          color="primary"
          density="comfortable"
          hide-details
          label="Active only"
        />
      </v-col>

      <v-col cols="12">
        <div class="d-flex align-center">
          <div class="d-flex flex-wrap align-center ga-2">
            <v-chip-group
              v-model="store.familyFilters"
              column
              filter
              multiple
            >
              <v-chip
                v-for="family in store.families"
                :key="family"
                filter
                :text="family"
                :value="family"
                variant="outlined"
              />
            </v-chip-group>

            <v-btn
              v-if="hasActiveFilters"
              density="comfortable"
              prepend-icon="mdi-filter-off-outline"
              size="small"
              variant="text"
              @click="store.resetFilters()"
            >
              Clear filters
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Mobile -->
    <v-row
      align="center"
      dense
      class="d-md-none"
    >
      <!-- Search -->
      <v-col cols="6">
        <v-text-field
          v-model="store.searchQuery"
          clearable
          density="comfortable"
          hide-details
          label="Search rockets by name"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
      </v-col>

      <!-- Sort -->
      <v-col cols="6">
        <v-select
          v-model="store.sortBy"
          density="comfortable"
          hide-details
          :items="sortOptions"
          label="Sort by"
          variant="outlined"
        />
      </v-col>

      <!-- Family + Active -->
      <v-col cols="12">
        <div class="d-flex align-center">
          <div class="d-flex flex-wrap align-center ga-2">
            <v-chip-group
              v-model="store.familyFilters"
              column
              filter
              multiple
            >
              <v-chip
                v-for="family in store.families"
                :key="family"
                filter
                :text="family"
                :value="family"
                variant="outlined"
              />
            </v-chip-group>

            <v-btn
              v-if="hasActiveFilters"
              density="comfortable"
              prepend-icon="mdi-filter-off-outline"
              size="small"
              variant="text"
              @click="store.resetFilters()"
            >
              Clear filters
            </v-btn>
          </div>

          <v-spacer />

          <v-switch
            v-model="store.activeOnly"
            color="primary"
            density="comfortable"
            hide-details
            label="Active only"
          />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRocketStore } from '@/stores/rockets'
  import type { SortOption } from '@/stores/rockets'

  const store = useRocketStore()

  const sortOptions: { title: string, value: SortOption }[] = [
    { title: 'Default order', value: 'default' },
    { title: 'Name (A–Z)', value: 'name-asc' },
    { title: 'Name (Z–A)', value: 'name-desc' },
    { title: 'Cost (low to high)', value: 'cost-asc' },
    { title: 'Cost (high to low)', value: 'cost-desc' },
    { title: 'First flight (oldest)', value: 'date-asc' },
    { title: 'First flight (newest)', value: 'date-desc' },
  ]

  const hasActiveFilters = computed(() =>
    store.searchQuery.trim() !== '' ||
    store.familyFilters.length > 0 ||
    store.activeOnly ||
    store.sortBy !== 'default',
  )
</script>

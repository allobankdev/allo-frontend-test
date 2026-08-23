<template>
  <v-card class="mb-6 pa-4" elevation="1">
    <v-row dense align="center">
      <v-col cols="12" md="5">
        <v-text-field
          v-model="searchQuery"
          label="Filter rockets by name or description..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="selectedCountry"
          :items="countryOptions"
          label="Country"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
        />
      </v-col>

      <v-col cols="8" sm="4" md="3">
        <v-select
          v-model="sortBy"
          :items="sortOptions"
          item-title="title"
          item-value="value"
          label="Sort By"
          variant="outlined"
          density="comfortable"
          hide-details
        />
      </v-col>

      <v-col cols="4" sm="2" md="1" class="d-flex justify-end">
        <v-btn
          :icon="sortOrder === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'"
          variant="tonal"
          color="primary"
          @click="toggleSortOrder"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRockets } from '@/composables/useRockets';

const {
  searchQuery,
  selectedCountry,
  sortBy,
  sortOrder,
  availableCountries,
} = useRockets();

const countryOptions = computed(() => {
  return availableCountries.value;
});

const sortOptions = [
  { title: 'Rocket Name', value: 'name' },
  { title: 'First Flight', value: 'flight' },
  { title: 'Launch Cost', value: 'cost' },
];

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
}
</script>

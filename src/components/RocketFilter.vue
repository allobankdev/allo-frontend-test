<template>
  <v-card class="pa-4 mb-6" rounded="lg" variant="outlined">
    <v-row dense align="center">
      <!-- Search Input -->
      <v-col cols="12" md="4">
        <v-text-field
          v-model="rocketStore.searchFilter"
          clearable
          density="compact"
          hide-details
          label="Cari nama atau deskripsi..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
      </v-col>

      <!-- Country Filter -->
      <v-col cols="12" sm="4" md="3">
        <v-select
          v-model="rocketStore.countryFilter"
          :items="countryOptions"
          item-title="title"
          item-value="value"
          density="compact"
          hide-details
          label="Negara"
          prepend-inner-icon="mdi-flag"
          variant="outlined"
        />
      </v-col>

      <!-- Flight Status Filter -->
      <v-col cols="12" sm="4" md="2">
        <v-select
          v-model="rocketStore.flightStatusFilter"
          :items="flightStatusOptions"
          item-title="title"
          item-value="value"
          density="compact"
          hide-details
          label="Status Terbang"
          prepend-inner-icon="mdi-rocket-launch-outline"
          variant="outlined"
        />
      </v-col>

      <!-- Cost Status Filter -->
      <v-col cols="12" sm="4" md="2">
        <v-select
          v-model="rocketStore.costStatusFilter"
          :items="costStatusOptions"
          item-title="title"
          item-value="value"
          density="compact"
          hide-details
          label="Data Biaya"
          prepend-inner-icon="mdi-currency-usd"
          variant="outlined"
        />
      </v-col>
    </v-row>

    <!-- Filter Result Counter & Active Filter Indicators -->
    <div
      class="d-flex align-center justify-space-between flex-wrap gap-2 mt-3 pt-3 border-t"
    >
      <div class="text-caption text-medium-emphasis">
        Menampilkan
        <strong class="text-white">{{
          rocketStore.filteredRockets.length
        }}</strong>
        dari
        <strong class="text-white">{{ rocketStore.rockets.length }}</strong>
        roket
      </div>

      <v-btn
        v-if="rocketStore.isFilterActive"
        color="warning"
        size="x-small"
        variant="text"
        prepend-icon="mdi-filter-remove-outline"
        @click="rocketStore.resetFilters()"
      >
        Hapus Semua Filter
      </v-btn>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRocketStore } from "@/stores/rocketStore";

import type { FlightStatusFilter, CostStatusFilter } from "@/types/rocket";

const rocketStore = useRocketStore();

// Country dropdown options
const countryOptions = computed(() => {
  const options: { title: string; value: string | null }[] = [
    { title: "Semua Negara", value: null },
  ];
  for (const country of rocketStore.availableCountries) {
    options.push({ title: country, value: country });
  }
  return options;
});

// Flight status options
const flightStatusOptions: { title: string; value: FlightStatusFilter }[] = [
  { title: "Semua Status", value: "all" },
  { title: "Pernah Terbang", value: "flown" },
  { title: "Belum Terbang", value: "not_flown" },
];

// Cost status options
const costStatusOptions: { title: string; value: CostStatusFilter }[] = [
  { title: "Semua Biaya", value: "all" },
  { title: "Ada Data Biaya", value: "has_cost" },
  { title: "Tidak Diketahui", value: "no_cost" },
];
</script>

<style scoped>
.border-t {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
</style>

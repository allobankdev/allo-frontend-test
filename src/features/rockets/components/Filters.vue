<template>
  <v-card variant="tonal" class="mb-4 pa-4">
    <v-text-field
      v-model="filtersStore.searchQuery"
      label="Search"
      variant="outlined"
      density="compact"
      :disabled="isLoading"
      hide-details
      clearable
    ></v-text-field>
  </v-card>
</template>

<script lang="ts" setup>
import { useFiltersStore } from "@/stores/filters";

defineProps<{
  isLoading: boolean;
}>();

const filtersStore = useFiltersStore();
</script>

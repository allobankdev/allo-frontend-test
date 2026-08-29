<script setup>
import { useRocketStore } from "@/stores/rocketStores";
const store = useRocketStore();
</script>

<template>
  <div class="mx-auto px-4 py-6">
    <v-text-field
      v-model="store.filterText"
      label="Search Rockets"
      variant="outlined"
      density="comfortable"
      clearable
      prepend-inner-icon="mdi-magnify"
      class="mb-6"
      hide-details
    ></v-text-field>
  </div>
</template>

<style scoped>
:deep(.v-field) {
  border-radius: 12px;
}

:deep(.v-field--focused) {
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}
</style>

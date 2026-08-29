<template>
  <div class="d-flex align-center gap-2">
    <span class="text-subtitle-2 text-grey-darken-1">Filter:</span>
    <v-btn-toggle
      v-model="selectedActive"
      mandatory
      color="primary"
      divided
      variant="outlined"
      class="mx-2">
      <v-btn :value="null" size="small">
        <v-icon start> mdi-rocket </v-icon>
        All
      </v-btn>
      <v-btn :value="true" size="small">
        <v-icon start> mdi-check-circle </v-icon>
        Active
      </v-btn>
      <v-btn :value="false" size="small">
        <v-icon start> mdi-close-circle </v-icon>
        Inactive
      </v-btn>
    </v-btn-toggle>
    <v-text-field
      v-model="selectedSearch"
      label="Search rocket"
      variant="outlined"
      prepend-inner-icon="mdi-magnify"
      density="compact"
      hide-details />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRocketStore } from '@/stores';

const store = useRocketStore();

const selectedActive = computed({
  get: () => store.active,
  set: value => store.setFilter(value),
});
const selectedSearch = computed({
  get: () => store.search,
  set: value => (store.search = value),
});
</script>

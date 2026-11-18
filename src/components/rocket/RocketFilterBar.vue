<script lang="ts" setup>
import type { StatusFilter } from '@/stores/rockets'

const search = defineModel<string>('search', { required: true })
const status = defineModel<StatusFilter>('status', { required: true })
</script>

<template>
  <div class="d-flex flex-wrap align-center justify-space-between ga-4">
    <v-text-field
      v-model="search"
      label="Search rockets"
      placeholder="Falcon, Starship, ..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="comfortable"
      hide-details
      clearable
      class="filter-bar__search"
    />

    <div class="d-flex align-center ga-3">
      <span class="text-caption text-medium-emphasis">Status</span>
      <v-btn-toggle
        v-model="status"
        mandatory
        divided
        variant="outlined"
        density="comfortable"
      >
        <v-btn
          value="all"
          size="small"
        >
          All
        </v-btn>
        <v-btn
          value="active"
          size="small"
        >
          Active
        </v-btn>
        <v-btn
          value="retired"
          size="small"
        >
          Retired
        </v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>

<style scoped>
.filter-bar__search {
    flex: 1 1 280px;
    max-width: 420px;
}
</style>

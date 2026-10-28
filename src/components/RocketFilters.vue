<template>
  <div class="rocket-filters">
    <v-row align="center" :dense="true">
      <!-- Search -->
      <v-col cols="12" sm="6" md="5">
        <v-text-field
          :model-value="searchQuery"
          label="Search rockets…"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          @update:model-value="$emit('update:searchQuery', $event ?? '')"
          @click:clear="$emit('update:searchQuery', '')"
        />
      </v-col>

      <!-- Filter chips -->
      <v-col cols="12" sm="6" md="7">
        <div class="d-flex flex-wrap gap-2">
          <v-chip-group
            :model-value="filterStatus"
            mandatory
            selected-class="text-primary"
            @update:model-value="$emit('update:filterStatus', $event)"
          >
            <v-chip value="all" variant="tonal">
              <v-icon start icon="mdi-all-inclusive" />
              All
            </v-chip>
            <v-chip value="with-image" variant="tonal">
              <v-icon start icon="mdi-image" />
              With Image
            </v-chip>
            <v-chip value="no-image" variant="tonal">
              <v-icon start icon="mdi-image-off" />
              No Image
            </v-chip>
          </v-chip-group>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { FilterStatus } from '@/types/rocket'

defineProps<{
  searchQuery: string
  filterStatus: FilterStatus
}>()

defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: FilterStatus]
}>()
</script>


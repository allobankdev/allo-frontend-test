<template>
  <v-card
    variant="flat"
    class="pa-4 mb-6 rounded-lg border bg-surface"
  >
    <v-row
      align="center"
      justify="space-between"
      dense
    >
      <!-- Search Input -->
      <v-col
        cols="12"
        md="5"
      >
        <v-text-field
          :model-value="searchQuery"
          label="Search rockets by name, family, or description..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          placeholder="e.g. Falcon 9, Starship..."
          aria-label="Search rockets"
          @update:model-value="$emit('update:searchQuery', $event || '')"
        />
      </v-col>

      <!-- Status Filter Chips -->
      <v-col
        cols="12"
        sm="7"
        md="4"
        class="d-flex align-center justify-start justify-md-center mt-2 mt-md-0"
      >
        <v-chip-group
          :model-value="statusFilter"
          mandatory
          selected-class="text-primary font-weight-bold"
          variant="tonal"
          @update:model-value="$emit('update:statusFilter', $event as RocketStatusFilter)"
        >
          <v-chip
            v-for="option in FILTER_STATUS_OPTIONS"
            :key="option.value"
            :value="option.value"
            filter
            size="default"
            class="text-none"
          >
            {{ option.title }}
          </v-chip>
        </v-chip-group>
      </v-col>

      <!-- Add New Rocket Button -->
      <v-col
        cols="12"
        sm="5"
        md="3"
        class="d-flex justify-start justify-sm-end mt-2 mt-md-0"
      >
        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-plus"
          block
          size="large"
          class="text-none font-weight-bold"
          @click="$emit('openAddDialog')"
        >
          Add New Rocket
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import type { RocketStatusFilter } from '@/types/rocket'
import { FILTER_STATUS_OPTIONS } from '@/utils/constants'

interface Props {
  searchQuery: string
  statusFilter: RocketStatusFilter
  totalCount: number
  filteredCount: number
}

defineProps<Props>()

defineEmits<{
  'update:searchQuery': [query: string]
  'update:statusFilter': [status: RocketStatusFilter]
  openAddDialog: []
}>()
</script>

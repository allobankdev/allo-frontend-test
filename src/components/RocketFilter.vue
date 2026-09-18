<template>
  <v-sheet
    class="pa-4 rounded-xl mb-6"
    color="surface"
    elevation="2"
    border
  >
    <v-row
      align="center"
      dense
    >
      <!-- Search Input -->
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :model-value="searchQuery"
          label="Search rockets by name, family, or description..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          rounded="lg"
          @update:model-value="$emit('update:searchQuery', $event || '')"
        />
      </v-col>

      <!-- Family Filter -->
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-select
          :model-value="familyFilter"
          :items="families"
          label="Rocket Family"
          prepend-inner-icon="mdi-filter-variant"
          variant="outlined"
          density="comfortable"
          hide-details
          rounded="lg"
          @update:model-value="$emit('update:familyFilter', $event)"
        />
      </v-col>

      <!-- Add New Rocket Button -->
      <v-col
        cols="12"
        sm="6"
        md="3"
        class="d-flex justify-sm-end"
      >
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-plus"
          elevation="2"
          rounded="lg"
          block
          class="text-none font-weight-bold"
          @click="$emit('openAddDialog')"
        >
          Add Rocket
        </v-btn>
      </v-col>
    </v-row>

    <!-- Quick stats / badges bar -->
    <div class="d-flex align-center justify-space-between mt-3 px-1">
      <span class="text-caption text-medium-emphasis">
        Showing <strong>{{ currentCount }}</strong> of <strong>{{ totalCount }}</strong> rockets
      </span>

      <v-btn
        v-if="searchQuery || familyFilter !== 'All'"
        variant="text"
        size="small"
        color="secondary"
        class="text-none"
        prepend-icon="mdi-close-circle-outline"
        @click="$emit('resetFilter')"
      >
        Reset Filters
      </v-btn>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
defineProps<{
  searchQuery: string
  familyFilter: string
  families: string[]
  currentCount: number
  totalCount: number
}>()

defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:familyFilter', value: string): void
  (e: 'openAddDialog'): void
  (e: 'resetFilter'): void
}>()
</script>

<template>
  <div>
    <!-- Error State -->
    <v-card
      v-if="type === 'error'"
      class="pa-8 text-center rounded-lg border mx-auto my-8"
      max-width="540"
      color="surface"
      elevation="0"
      style="border-color: rgba(244, 63, 94, 0.3) !important;"
    >
      <v-avatar
        color="rgba(244, 63, 94, 0.15)"
        size="64"
        class="mb-4"
      >
        <v-icon
          icon="mdi-alert-circle-outline"
          color="error"
          size="36"
        />
      </v-avatar>

      <h3 class="text-h6 font-weight-bold mb-2 text-high-emphasis">
        {{ title || 'Telemetry Link Disrupted' }}
      </h3>

      <p class="text-body-2 text-secondary mb-6">
        {{ message || 'Failed to establish connection with the Launch Library 2 API. Please verify network access.' }}
      </p>

      <div class="d-flex justify-center ga-3">
        <v-btn
          color="error"
          variant="flat"
          prepend-icon="mdi-refresh"
          class="text-none font-weight-bold px-6"
          rounded="sm"
          @click="$emit('retry')"
        >
          Retry Connection
        </v-btn>
      </div>
    </v-card>

    <!-- Empty Search State -->
    <v-card
      v-else-if="type === 'empty'"
      class="pa-8 text-center rounded-lg border mx-auto my-8"
      max-width="540"
      color="surface"
      elevation="0"
      style="border-color: rgba(255, 255, 255, 0.08) !important;"
    >
      <v-avatar
        color="surface-variant"
        size="64"
        class="mb-4"
      >
        <v-icon
          icon="mdi-magnify-remove-outline"
          color="secondary"
          size="36"
        />
      </v-avatar>

      <h3 class="text-h6 font-weight-bold mb-2 text-high-emphasis">
        No Matching Launch Vehicles
      </h3>

      <p class="text-body-2 text-secondary mb-6">
        No SpaceX rockets match your current query "{{ searchQuery }}". Try adjusting your search keywords or resetting filters.
      </p>

      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-filter-remove"
        class="text-none font-weight-bold"
        rounded="sm"
        @click="$emit('reset')"
      >
        Clear Filters
      </v-btn>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  type: 'error' | 'empty'
  title?: string
  message?: string
  searchQuery?: string
}>()

defineEmits<{
  (e: 'retry'): void
  (e: 'reset'): void
}>()
</script>

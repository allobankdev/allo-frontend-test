<template>
  <div>
    <!-- Error State -->
    <div
      v-if="type === 'error'"
      class="cad-frame pa-8 text-center rounded-sm mx-auto my-8"
      style="max-width: 520px; border-color: rgba(244, 63, 94, 0.4) !important;"
    >
      <div class="status-icon-wrap mx-auto mb-4 d-flex align-center justify-center">
        <v-icon
          icon="mdi-alert-octagon-outline"
          color="error"
          size="32"
        />
      </div>

      <h3 class="text-h6 font-weight-bold mb-2 text-high-emphasis">
        {{ title || 'Telemetry Link Offline' }}
      </h3>

      <p class="text-body-2 text-secondary mb-6">
        {{ message || 'The Launch Library 2 telemetry pipeline could not be reached. Verify network connectivity or retry.' }}
      </p>

      <div class="d-flex justify-center">
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
    </div>

    <!-- Empty Search State -->
    <div
      v-else-if="type === 'empty'"
      class="cad-frame pa-8 text-center rounded-sm mx-auto my-8"
      style="max-width: 520px;"
    >
      <div class="status-icon-wrap mx-auto mb-4 d-flex align-center justify-center">
        <v-icon
          icon="mdi-database-search-outline"
          color="secondary"
          size="32"
        />
      </div>

      <h3 class="text-h6 font-weight-bold mb-2 text-high-emphasis">
        No Launch Vehicles Found
      </h3>

      <p class="text-body-2 text-secondary mb-6">
        No registered SpaceX configurations match the search filter <span
          v-if="searchQuery"
          class="font-mono text-primary"
        >"{{ searchQuery }}"</span>. Reset filters to view all 13 SpaceX orbital configurations.
      </p>

      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-filter-remove-outline"
        class="text-none font-weight-bold"
        rounded="sm"
        @click="$emit('reset')"
      >
        Clear Filters
      </v-btn>
    </div>
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

<style scoped>
.status-icon-wrap {
  width: 56px;
  height: 56px;
  background: var(--console-surface-elevated);
  border: 1px solid var(--titanium-border);
  border-radius: 4px;
}
</style>

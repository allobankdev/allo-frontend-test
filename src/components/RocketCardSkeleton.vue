<template>
  <div
    class="cad-frame rounded-sm h-100 d-flex flex-column w-100"
    style="min-height: 420px;"
  >
    <!-- Image Skeleton matching 200px height -->
    <v-skeleton-loader
      type="image"
      height="200"
      class="bg-surface-variant"
    />

    <div class="pa-4 d-flex flex-column flex-grow-1">
      <!-- Family / Category skeleton -->
      <v-skeleton-loader
        type="text"
        width="110"
        height="16"
        class="mb-2"
      />

      <!-- Title skeleton -->
      <v-skeleton-loader
        type="heading"
        class="mb-3"
      />

      <!-- Description skeleton -->
      <v-skeleton-loader
        type="sentences"
        class="mb-4 flex-grow-1"
      />

      <!-- Divider -->
      <div
        class="mb-3"
        style="height: 1px; background: var(--titanium-border);"
      />

      <!-- Footer specs skeleton -->
      <div class="d-flex align-center justify-space-between pt-1">
        <v-skeleton-loader
          type="text"
          width="90"
        />
        <v-skeleton-loader
          type="button"
          width="100"
          height="32"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Structural skeleton component matching RocketCard architecture
</script>

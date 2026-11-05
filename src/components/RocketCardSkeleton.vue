<template>
  <v-card
    class="h-100 rounded-lg overflow-hidden border"
    color="surface"
    elevation="0"
    style="border-color: rgba(255, 255, 255, 0.08) !important;"
  >
    <!-- Image Skeleton 16:9 ratio -->
    <v-skeleton-loader
      type="image"
      height="220"
      class="bg-surface-variant"
    />

    <v-card-text class="pa-4">
      <!-- Badge row skeleton -->
      <div class="d-flex ga-2 mb-3">
        <v-skeleton-loader
          type="chip"
          width="60"
          height="24"
        />
        <v-skeleton-loader
          type="chip"
          width="80"
          height="24"
        />
      </div>

      <!-- Title skeleton -->
      <v-skeleton-loader
        type="heading"
        class="mb-3"
      />

      <!-- Description skeleton -->
      <v-skeleton-loader
        type="sentences"
        class="mb-4"
      />

      <!-- Footer Button skeleton -->
      <v-skeleton-loader
        type="button"
        width="100%"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
// Pure skeleton component
</script>

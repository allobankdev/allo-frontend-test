<!--
  Fungsi: Komponen buat nampilin state loading (skeleton grid / spinner) sama tampilan
          error lengkap dengan tombol Retry.
  Props:
    - type: 'loading' | 'error'
    - variant: 'grid' | 'detail' (opsional)
    - message: pesan custom (opsional)
    - showRetry: nampilin tombol Retry kalau lagi error
  Emits:
    - retry: jalan waktu tombol Retry diklik
  Dipakai di:
    - src/pages/index.vue
    - src/pages/rockets/[id].vue
-->

<script setup lang="ts">
defineProps<{
  type: 'loading' | 'error'
  variant?: 'grid' | 'detail'
  message?: string
  showRetry?: boolean
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <!-- Skeleton Grid untuk List Page -->
  <v-row
    v-if="type === 'loading' && variant === 'grid'"
    role="status"
    aria-label="Loading rockets"
  >
    <v-col
      v-for="n in 6"
      :key="n"
      cols="12"
      sm="6"
      md="4"
    >
      <v-card
        variant="outlined"
        rounded="lg"
        class="skeleton-card overflow-hidden"
      >
        <v-skeleton-loader type="image, article" />
      </v-card>
    </v-col>
  </v-row>

  <!-- Loading Ringkas untuk Detail Page -->
  <v-sheet
    v-else-if="type === 'loading'"
    border
    rounded="lg"
    class="pa-12 text-center status-sheet"
    role="status"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="34"
      width="3"
      class="mb-4"
    />
    <p
      class="font-mono text-caption text-uppercase mb-0"
      style="color: var(--ink-muted)"
    >
      {{ message ?? 'Fetching telemetry data...' }}
    </p>
  </v-sheet>

  <!-- Error State + Retry -->
  <v-sheet
    v-else
    border
    rounded="lg"
    class="pa-10 text-center status-sheet"
    role="alert"
  >
    <div class="error-icon-wrap mx-auto mb-4">
      <v-icon
        icon="mdi-wifi-alert"
        color="error"
        size="26"
      />
    </div>
    <h2 class="font-display text-h6 font-weight-bold mb-1">
      Unable to load data
    </h2>
    <p
      class="text-body-2 mb-5 mx-auto"
      style="color: var(--ink-secondary); max-width: 420px"
    >
      {{ message ?? 'Something went wrong while contacting Launch Library API.' }}
    </p>
    <v-btn
      v-if="showRetry"
      color="primary"
      variant="flat"
      prepend-icon="mdi-refresh"
      @click="$emit('retry')"
    >
      Try Again
    </v-btn>
  </v-sheet>
</template>

<style scoped>
.skeleton-card,
.status-sheet {
  background-color: #ffffff;
  border-color: var(--border-hairline) !important;
}

.error-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  display: grid;
  place-items: center;
}
</style>
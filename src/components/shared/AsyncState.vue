<script lang="ts" setup>
interface Props {
  status: 'loading' | 'error' | 'success'
  errorMessage?: string | null
  onRetry: () => void
}

defineProps<Props>()
</script>

<template>
  <template v-if="status === 'loading'">
    <slot name="loading">
      <div class="d-flex justify-center align-center pa-8">
        <v-progress-circular
          color="primary"
          indeterminate
        />
      </div>
    </slot>
  </template>

  <template v-else-if="status === 'error'">
    <v-alert
      class="ma-4"
      type="error"
      variant="tonal"
    >
      <p class="mb-2">
        {{ errorMessage ?? 'Terjadi kesalahan' }}
      </p>
      <v-btn
        color="error"
        size="small"
        variant="outlined"
        @click="onRetry"
      >
        Coba lagi
      </v-btn>
    </v-alert>
  </template>

  <template v-else>
    <slot />
  </template>
</template>

<script setup lang="ts">
defineProps<{ loading?: boolean; message?: string }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div
    v-if="loading"
    class="request-state"
    role="status"
    aria-live="polite"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      :size="32"
      :width="3"
    />
    <p>Loading rockets…</p>
  </div>
  <div
    v-else
    class="request-state error-state"
    role="alert"
  >
    <h2>We couldn’t load this.</h2>
    <p>{{ message }}</p>
    <v-btn
      color="primary"
      variant="flat"
      @click="$emit('retry')"
    >
      Try again
    </v-btn>
  </div>
</template>

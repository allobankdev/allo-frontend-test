<template>
  <div class="hig-error-state" role="alert" aria-live="assertive">
    <v-icon
      size="56"
      color="warning"
      class="mb-4"
      aria-hidden="true"
    >
      mdi-alert-circle-outline
    </v-icon>

    <h2 class="hig-title2 mb-2">Something went wrong</h2>

    <p class="hig-subhead hig-secondary mb-6">
      {{ message || 'Unable to load rockets. Please try again.' }}
    </p>

    <v-btn
      color="primary"
      variant="elevated"
      rounded="pill"
      class="hig-retry-btn"
      aria-label="Retry loading rockets"
      @click="$emit('retry')"
    >
      Try Again
    </v-btn>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string }>()
defineEmits<{ retry: [] }>()
</script>

<style scoped>
.hig-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--hig-space-3xl) var(--hig-space-xl);
  min-height: 300px;
  font-family: var(--hig-font-stack);
}

.hig-title2 {
  font-size: var(--hig-title2-size);
  font-weight: var(--hig-title2-weight);
  line-height: var(--hig-title2-lh);
  color: var(--hig-label);
  margin: 0;
}

.hig-subhead {
  font-size: var(--hig-subhead-size);
  line-height: var(--hig-subhead-lh);
  margin: 0;
}

.hig-secondary {
  color: var(--hig-secondary-label);
  max-width: 280px;
}

.hig-retry-btn {
  min-height: var(--hig-tap-target) !important;
  min-width: 120px;
  font-size: var(--hig-body-size);
  font-family: var(--hig-font-stack);
}
</style>

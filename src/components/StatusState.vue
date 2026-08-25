<template>
  <div class="d-flex flex-column align-center justify-center py-12 text-center glass-card rounded-xl">
    <div v-if="loading" class="animate-pulse">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        width="6"
      ></v-progress-circular>
      <h3 class="mt-6 text-h5 font-weight-bold text-gradient">Ignition sequence start...</h3>
      <p class="text-subtitle-1 text-medium-emphasis">Fetching rocket data from orbit</p>
    </div>

    <div v-else-if="error" v-motion-roll-visible-left>
      <v-icon
        icon="mdi-alert-circle-outline"
        color="error"
        size="64"
        class="mb-4"
      ></v-icon>
      <h3 class="text-h5 font-weight-bold text-error">Houston, we have a problem</h3>
      <p class="text-subtitle-1 text-medium-emphasis mt-2">{{ error }}</p>
      <v-btn
        color="primary"
        variant="elevated"
        class="mt-6 px-8 rounded-pill"
        prepend-icon="mdi-refresh"
        @click="$emit('retry')"
      >
        Retry Mission
      </v-btn>
    </div>

    <div v-else-if="empty" v-motion-fade>
      <v-icon
        icon="mdi-rocket-outline"
        color="primary"
        size="64"
        class="mb-4"
      ></v-icon>
      <h3 class="text-h5 font-weight-bold">No rockets found</h3>
      <p class="text-subtitle-1 text-medium-emphasis mt-2">Try adjusting your search filters</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
}>();

defineEmits(['retry']);
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.text-gradient {
  background: linear-gradient(45deg, #2196F3, #21CBF3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>

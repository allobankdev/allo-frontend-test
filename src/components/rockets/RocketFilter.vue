<template>
  <div class="cyber-search-wrapper">
    <v-text-field
      v-model="model"
      prepend-inner-icon="mdi-radar"
      label="SCAN ARCHIVE..."
      variant="outlined"
      density="comfortable"
      hide-details
      clearable
      placeholder="Enter designation (e.g., Falcon)"
      base-color="rgba(0, 229, 255, 0.4)"
      color="cyan-accent-3"
      class="cyber-input"
    />
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>();
</script>

<style scoped>
.cyber-search-wrapper {
  position: relative;
  z-index: 10;
}

.cyber-input :deep(.v-field) {
  background: rgba(10, 14, 23, 0.7) !important;
  backdrop-filter: blur(8px);
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* Hover effect */
.cyber-input :deep(.v-field:hover) {
  background: rgba(0, 229, 255, 0.05) !important;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.1);
}

/* Focus state glow */
.cyber-input :deep(.v-field--focused) {
  background: rgba(0, 229, 255, 0.1) !important;
  box-shadow:
    0 0 20px rgba(0, 229, 255, 0.2),
    inset 0 0 10px rgba(0, 229, 255, 0.1) !important;
}

/* Typography tweaks */
.cyber-input :deep(input),
.cyber-input :deep(.v-label) {
  font-family: "Space Mono", monospace !important;
  letter-spacing: 0.05em;
}

.cyber-input :deep(.v-label) {
  color: #00e5ff !important;
  opacity: 0.7;
}

.cyber-input :deep(input) {
  color: #ffffff !important;
}

/* Icon colors */
.cyber-input :deep(.v-icon) {
  color: #00e5ff !important;
  opacity: 0.8;
}
</style>

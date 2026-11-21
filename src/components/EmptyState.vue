<template>
  <div class="empty-state">
    <v-icon
      size="64"
      icon="mdi-rocket-launch"
      class="mb-4 text-medium-emphasis"
    />
    <h3 class="text-h5 font-weight-medium mb-3">
      {{ title || 'No rockets found' }}
    </h3>
    <p 
      v-if="message" 
      class="text-body-2 text-medium-emphasis mb-6"
    >
      {{ message || '' }}
    </p>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title?: string
    message?: string
  }>()
  defineEmits<{
    clear: []
  }>()
</script>

<style lang="css" scoped>
  .empty-state {
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 2rem 0;
  }
</style>


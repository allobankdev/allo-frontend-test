<template>
  <div class="error-state">
    <h3 class="text-h3 font-weight-medium mb-3">
      {{ title || 'Somenthing wrong on this pages' }}
    </h3>
    <p 
      v-if="message" 
      class="text-body-2 text-medium-emphasis mb-6"
    >
      {{ message }}
    </p>
    <v-btn
      class="mt-3"
      variant="flat"
      size="large"
      prepend-icon="mdi-refresh"
      @click="$emit('retry')"
    >
      Retry Again
    </v-btn>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title?: string
    message?: string
  }>()
  defineEmits<{
    retry: []
  }>()
</script>

<style lang="css" scoped>
  .error-state {
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0;
  }
</style>


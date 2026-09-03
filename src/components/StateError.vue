<template>
  <v-container class="text-center py-16">
    <p class="text-body-2 text-on-surface-variant mb-5">
      {{ message }}
    </p>
    <v-btn
      color="primary"
      variant="flat"
      @click="emit('retry')"
    >
      Retry
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
defineProps<{ message: string }>()
const emit = defineEmits<{ retry: [] }>()
</script>
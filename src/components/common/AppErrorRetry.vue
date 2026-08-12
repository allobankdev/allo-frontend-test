<template>
  <v-alert
    type="error"
    variant="tonal"
    class="mb-4"
  >
    <template #text>
      <p class="mb-3">
        {{ message }}
      </p>
      <v-btn
        variant="outlined"
        color="error"
        prepend-icon="mdi-refresh"
        @click="$emit('retry')"
      >
        Try Again
      </v-btn>
    </template>
  </v-alert>
</template>

<script setup lang="ts">
defineProps<{ message: string }>()
defineEmits<{ retry: [] }>()
</script>

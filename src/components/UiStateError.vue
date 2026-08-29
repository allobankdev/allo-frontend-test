<template>
  <div class="d-flex flex-column align-center justify-center py-16">
    <v-icon
      size="64"
      color="error"
      class="mb-4"
    >
      mdi-alert-circle-outline
    </v-icon>
    <p class="text-body-1 text-medium-emphasis mb-4 text-center">
      {{ message }}
    </p>
    <v-btn
      color="primary"
      variant="tonal"
      prepend-icon="mdi-refresh"
      @click="$emit('retry')"
    >
      Retry
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ message?: string }>()
defineEmits<{ retry: [] }>()
</script>

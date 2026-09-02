<template>
  <v-container class="text-center py-16">
    <v-alert type="error" variant="tonal" class="mb-4">
      {{ message }}
    </v-alert>
    <v-btn color="primary" @click="emit('retry')">Retry</v-btn>
  </v-container>
</template>

<script setup lang="ts">
defineProps<{ message: string }>()
const emit = defineEmits<{ retry: [] }>()
</script>
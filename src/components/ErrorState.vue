<template>
  <div class="text-center py-10">
    <p>{{ message }}</p>
    <v-btn color="primary" @click="$emit('retry')">Retry</v-btn>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string }>()
defineEmits(['retry'])
</script>

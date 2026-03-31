<template>
    <div>
      <p>Error: {{ message }}</p>
      <v-btn @click="$emit('retry')">Retry</v-btn>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{ message: string }>()
  </script>
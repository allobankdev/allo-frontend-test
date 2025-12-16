<template>
    <v-text-field
      v-model="model"
      label="Filter Rocket"
      clearable
      class="mb-4"
      
    />
  </template>
  
  <script setup lang="ts">
    const model = defineModel<string>()
  </script>  
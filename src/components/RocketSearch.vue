<template>
  <v-text-field
    v-model="model"
    label="Search rockets"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    clearable
    hide-details
  />
</template>

<script lang="ts" setup>
  const model = defineModel<string>({ required: true })
</script>
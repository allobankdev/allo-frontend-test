<template>
  <v-text-field
    v-model="search"
    clearable
    density="comfortable"
    hide-details
    label="Search rockets by name"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
  />
</template>

<script lang="ts" setup>
  // `clearable` sets the value to null, so it is typed accordingly.
  const search = defineModel<string | null>({ required: true })
</script>

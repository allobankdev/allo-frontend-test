<template>
  <!-- Plain text input; typing updates the parent's v-model instantly. -->
  <v-text-field
    v-model="model"
    clearable
    density="comfortable"
    hide-details
    label="Filter rockets by name or description"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
  />
</template>

<script lang="ts" setup>
  // defineModel creates the prop + update event pair behind v-model for us.
  const model = defineModel<string>({ default: '' })
</script>

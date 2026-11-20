<template>
  <!-- Plain text input; typing updates the parent's v-model instantly. -->
  <v-text-field
    clearable
    density="comfortable"
    hide-details
    label="Filter rockets by name or description"
    :model-value="model"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    @update:model-value="onInput"
  />
</template>

<script lang="ts" setup>
  // defineModel creates the prop + update event pair behind v-model for us.
  const model = defineModel<string>({ default: '' })

  // Vuetify's clear (X) button emits `null` instead of an empty string.
  // Normalise it here so the parent always receives a plain string and
  // string methods like trim() never run on null.
  function onInput (value: string | null) {
    model.value = value ?? ''
  }
</script>

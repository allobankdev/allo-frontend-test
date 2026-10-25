<template>
  <v-text-field
    clearable
    density="comfortable"
    hide-details
    label="Filter rockets"
    :model-value="modelValue"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    @update:model-value="onUpdate"
  />
</template>

<script lang="ts" setup>
  defineProps<{
    modelValue: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  function onUpdate (value: string | null): void {
    emit('update:modelValue', value ?? '')
  }
</script>

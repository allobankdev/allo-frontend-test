<template>
  <v-text-field
    :model-value="modelValue"
    label="Search rockets..."
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    density="comfortable"
    clearable
    hide-details
    @update:model-value="$emit('update:modelValue', $event ?? '')"
  />
</template>

<script lang="ts" setup>
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

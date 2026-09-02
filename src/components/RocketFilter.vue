<template>
  <v-text-field
    :model-value="modelValue"
    label="Search rockets…"
    prepend-inner-icon="mdi-magnify"
    clearable
    hide-details
    variant="outlined"
    density="comfortable"
    @update:model-value="emit('update:modelValue', $event ?? '')"
  />
</template>

<script lang="ts" setup>
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>


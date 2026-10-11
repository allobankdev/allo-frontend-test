<template>
  <v-text-field
    :model-value="modelValue"
    clearable
    density="comfortable"
    hide-details
    label="Filter rockets"
    placeholder="Search by name or description"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
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

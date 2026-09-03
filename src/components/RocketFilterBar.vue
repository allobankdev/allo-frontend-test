<script setup>
defineProps({
  modelValue: { type: String, default: '' },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    label="Filter rockets by name"
    placeholder="e.g. Falcon 9"
    prepend-inner-icon="mdi-magnify"
    clearable
    variant="outlined"
    density="comfortable"
    hide-details
    @update:model-value="$emit('update:modelValue', $event ?? '')"
  />
</template>

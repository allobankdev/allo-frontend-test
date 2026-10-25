<template>
  <v-text-field
    :model-value="modelValue"
    clearable
    color="primary"
    density="comfortable"
    label="Filter by name"
    prepend-inner-icon="mdi-magnify"
    variant="underlined"
    @update:model-value="emit('update:modelValue', $event ?? '')"
  />
</template>

<script lang="ts" setup>
  defineProps<{ modelValue: string }>()
  const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

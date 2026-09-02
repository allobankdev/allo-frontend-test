<template>
  <v-text-field
    :model-value="modelValue"
    label="Filter rockets by name"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    density="compact"
    clearable
    class="mb-4"
    @update:model-value="emit('update:modelValue', $event ?? '')"
  />
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
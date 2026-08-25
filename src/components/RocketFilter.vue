<template>
  <v-text-field
    :model-value="modelValue"
    label="Search rockets"
    prepend-inner-icon="mdi-magnify"
    clearable
    density="comfortable"
    variant="outlined"
    @update:model-value="$emit('update:modelValue', $event ?? '')"
  />
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>();
defineEmits<{ "update:modelValue": [value: string] }>();
</script>

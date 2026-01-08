<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
<template>
  <v-text-field label="Filter Rocket" :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" clearable />
</template>

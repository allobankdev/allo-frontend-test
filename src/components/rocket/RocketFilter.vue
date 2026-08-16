<template>
  <v-text-field
    :model-value="modelValue"
    label="Search rockets"
    placeholder="e.g. Falcon 9"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    clearable
    hide-details
    class="tes"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

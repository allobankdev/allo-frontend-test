<template>
  <v-text-field
    :model-value="modelValue"
    placeholder="Filter rockets by name"
    prepend-inner-icon="mdi-magnify"
    clearable
    @update:model-value="(val) => $emit('update:modelValue', val ?? '')"
  />
</template>

<script lang="ts" setup>
defineProps<{ modelValue: string }>();
defineEmits<{ "update:modelValue": [value: string] }>();
</script>

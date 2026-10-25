<template>
  <v-text-field
    :model-value="modelValue"
    label="Filter rockets"
    placeholder="Search by name or description"
    prepend-inner-icon="mdi-magnify"
    clearable
    hide-details
    variant="outlined"
    @update:model-value="$emit('update:modelValue', $event ?? '')"
  >
    <template #append-inner>
      <span class="text-caption text-no-wrap">{{ count }} results</span>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
  defineProps<{ modelValue: string, count: number }>()
  defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

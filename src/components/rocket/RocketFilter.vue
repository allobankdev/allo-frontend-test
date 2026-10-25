<template>
  <v-text-field
    :model-value="modelValue"
    placeholder="Filter rockets by name..."
    prepend-inner-icon="mdi-magnify"
    clear-icon="mdi-close-circle"
    clearable
    variant="outlined"
    density="comfortable"
    hide-details
    class="rocket-search-field"
    @update:model-value="$emit('update:modelValue', $event || '')"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped>
.rocket-search-field {
  max-width: 420px;
}
</style>

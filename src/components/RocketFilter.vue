<script setup lang="ts">
defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <input
    class="input"
    type="search"
    placeholder="Filter by name or description"
    aria-label="Filter rockets"
    :value="modelValue"
    @input="onInput"
  />
</template>

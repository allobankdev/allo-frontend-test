<script setup lang="ts">

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleInput = (event: Event) => {

  const target = event.target as HTMLInputElement

  emit('update:modelValue', target.value)
}

</script>

<template>

  <input
    :value="modelValue"
    @input="handleInput"
    placeholder="Search Rocket..."
  />

</template>
<template>
  <v-text-field
    :model-value="modelValue"
    label="Filter Rocket"
    placeholder="Cari nama atau deskripsi..."
    prepend-inner-icon="mdi-magnify"
    clearable
    hide-details
    @update:model-value="onInput"
  />
</template>

<script setup lang="ts">
  interface Props {
    modelValue: string
  }

  interface Emits {
    (event: 'update:modelValue', value: string): void
  }

  defineProps<Props>()
  const emit = defineEmits<Emits>()

  function onInput(value: string | null) {
    emit('update:modelValue', value ?? '')
  }
</script>

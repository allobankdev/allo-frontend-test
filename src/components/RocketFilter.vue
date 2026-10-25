<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const local = ref(props.modelValue)
watch(() => props.modelValue, v => { local.value = v })
watch(local, v => { emit('update:modelValue', v) })
</script>

<template>
  <v-text-field
    v-model="local"
    prepend-inner-icon="mdi-magnify"
    label="Filter by name or description"
    variant="outlined"
    density="comfortable"
    hide-details
    clearable
  />
</template>

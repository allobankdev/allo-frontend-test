<script lang="ts" setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { mdiMagnify } from '@/constants/icons'

const DEBOUNCE_MS = 300

const model = defineModel<string>({ default: '' })

// The local input updates instantly for responsive typing; only the write to the
// store is debounced, so filteredRockets doesn't recompute on every keystroke.
const localValue = ref<string | null>(model.value)
let debounceTimer: ReturnType<typeof setTimeout> | undefined

watch(model, value => {
  if (value !== localValue.value) localValue.value = value
})

watch(localValue, value => {
  clearTimeout(debounceTimer)

  if (!value) {
    // Clearing (the x button, or deleting all text) applies immediately, no delay.
    model.value = ''
    return
  }

  debounceTimer = setTimeout(() => {
    model.value = value
  }, DEBOUNCE_MS)
})

onBeforeUnmount(() => clearTimeout(debounceTimer))
</script>

<template>
  <v-text-field
    v-model="localValue"
    clearable
    density="comfortable"
    hide-details
    label="Cari rocket berdasarkan nama"
    :prepend-inner-icon="mdiMagnify"
    variant="outlined"
  />
</template>

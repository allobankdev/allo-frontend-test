<template>
  <div class="search-container">
    <v-text-field
      :model-value="modelValue"
      placeholder="Search rocket name, description, or manufacturer..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="compact"
      rounded="pill"
      hide-details
      clearable
      single-line
      bg-color="surface"
      aria-label="Search rockets by keyword"
      class="search-input"
      @update:model-value="onInput"
      @click:clear="onClear"
    />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const props = withDefaults(
  defineProps<{
    modelValue?: string
    debounceMs?: number
  }>(),
  {
    modelValue: '',
    debounceMs: 300,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(value: string | null) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('update:modelValue', value?.trim() ? value : '')
  }, props.debounceMs)
}

function onClear() {
  if (debounceTimer) clearTimeout(debounceTimer)
  emit('update:modelValue', '')
}

onBeforeUnmount(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<style scoped>
.search-container {
  width: 100%;
  max-width: 540px;
}

:deep(.v-field--variant-outlined) {
  --v-field-border-opacity: 0.15;
  border-radius: 9999px !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

:deep(.v-field--variant-outlined:hover) {
  --v-field-border-opacity: 0.35;
}

:deep(.v-field--focused) {
  --v-field-border-opacity: 0.8 !important;
  box-shadow: 0 0 0 3px rgba(11, 37, 69, 0.08) !important;
}
</style>

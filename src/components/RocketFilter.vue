<script setup lang="ts">
/**
 * RocketFilter.vue
 *
 * Presentational search input. It uses v-model so it can be bound to the store
 * or to local state without any change.
 */

withDefaults(defineProps<{
  label?: string
  placeholder?: string
  disabled?: boolean
}>(), {
  label: 'Filter rockets',
  placeholder: 'Search by name, country, or description',
  disabled: false,
})

const model = defineModel<string>({ default: '' })

const emit = defineEmits<{ clear: [] }>()
</script>

<template>
  <v-text-field
    :disabled="disabled"
    :label="label"
    :model-value="model"
    :placeholder="placeholder"
    clearable
    density="comfortable"
    hide-details
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    @click:clear="emit('clear')"
    @update:model-value="model = $event ?? ''"
  />
</template>

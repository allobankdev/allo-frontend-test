<template>
  <div class="d-flex flex-column flex-sm-row ga-3">
    <v-text-field
      :model-value="modelValue"
      label="Search rockets"
      placeholder="Search by name or description..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      hide-details
      @update:model-value="$emit('update:modelValue', $event)"
    />

    <v-btn
      color="primary"
      size="large"
      prepend-icon="mdi-plus"
      class="flex-shrink-0"
      @click="$emit('add')"
    >
      Add Rocket
    </v-btn>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
  add: []
}>()
</script>
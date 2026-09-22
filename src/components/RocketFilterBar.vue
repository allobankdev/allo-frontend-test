<template>
  <div class="d-flex flex-wrap ga-3 mb-6">
    <v-text-field
      :model-value="modelValue"
      label="Filter by name or country"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="comfortable"
      hide-details
      clearable
      class="flex-grow-1"
      style="min-width: 240px;"
      @update:model-value="value => $emit('update:modelValue', value ?? '')"
    />
    <v-btn
      color="primary"
      prepend-icon="mdi-plus"
      size="large"
      @click="$emit('add')"
    >
      Add rocket
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string]; add: [] }>()
</script>

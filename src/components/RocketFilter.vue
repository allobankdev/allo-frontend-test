<template>
  <v-text-field
    :model-value="modelValue"
    clearable
    density="comfortable"
    hide-details
    label="Filter by name or description"
    placeholder="Search rockets..."
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    @update:model-value="onUpdate"
  />
</template>

<script lang="ts" setup>
  defineProps<{
    modelValue: string;
  }>();

  const emit = defineEmits<{
    "update:modelValue": [value: string];
  }>();

  function onUpdate(value: string | null) {
    emit("update:modelValue", value ?? "");
  }
</script>

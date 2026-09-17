<template>
  <label class="flex flex-col gap-1.5">
    <span class="text-sm font-medium">
      {{ label }}
      <span
        v-if="required"
        class="text-red-500"
      >*</span>
    </span>
    <slot />
    <span
      v-if="error"
      class="text-xs text-red-600"
    >
      {{ error }}
    </span>
  </label>
</template>

<script lang="ts" setup>
  defineProps<{
    label: string
    error?: string
    required?: boolean
  }>()
</script>

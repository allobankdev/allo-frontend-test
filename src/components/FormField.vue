<template>
  <div>
    <label
      :for="id"
      class="mb-1.5 block text-sm font-medium text-slate-300"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-flare-400"
        aria-hidden="true"
      >*</span>
      <span
        v-else
        class="font-normal text-slate-600"
      >(optional)</span>
    </label>
    <slot />
    <p
      v-if="error"
      :id="`${id}-error`"
      class="mt-1.5 text-xs text-rose-400"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      class="mt-1.5 text-xs text-slate-500"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{
    id: string
    label: string
    required?: boolean
    error?: string
    hint?: string
  }>(), {
    required: false,
    error: '',
    hint: '',
  })
</script>

<template>
  <section
    :aria-live="mode === 'error' ? 'assertive' : 'polite'"
    class="feedback-state"
    :role="mode === 'error' ? 'alert' : 'status'"
  >
    <v-icon
      :color="mode === 'error' ? 'error' : 'primary'"
      :icon="icon"
      size="40"
    />
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <v-btn
      v-if="actionLabel"
      :color="mode === 'error' ? 'error' : 'primary'"
      :prepend-icon="actionIcon"
      variant="outlined"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </v-btn>
  </section>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    mode?: 'error' | 'empty'
    icon: string
    title: string
    message: string
    actionLabel?: string
    actionIcon?: string
  }>(), {
    mode: 'empty',
    actionLabel: undefined,
    actionIcon: undefined,
  })

  defineEmits<{
    action: []
  }>()
</script>

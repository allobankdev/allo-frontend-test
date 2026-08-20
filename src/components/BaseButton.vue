<template>
  <button
    :id="id"
    :type="type"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    class="base-button"
    :class="[`base-button--${variant}`, { 'base-button--loading': loading }]"
    v-bind="$attrs"
  >
    <span v-if="loading" class="base-button__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    id?: string
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    id: undefined,
    type: 'button',
    variant: 'primary',
    disabled: false,
    loading: false,
  },
)
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
  white-space: nowrap;
  line-height: 1.4;
}

.base-button:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

.base-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.base-button--primary {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.base-button--primary:hover:not(:disabled) {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}

.base-button--secondary {
  background: transparent;
  color: var(--primary);
  border-color: var(--primary);
}
.base-button--secondary:hover:not(:disabled) {
  background: rgba(79, 122, 255, 0.08);
}

.base-button--danger {
  background: var(--error-bg);
  color: var(--error);
  border-color: var(--error);
}
.base-button--danger:hover:not(:disabled) {
  background: rgba(229, 83, 75, 0.18);
}

.base-button--ghost {
  background: transparent;
  color: var(--text-muted);
  border-color: var(--border);
}
.base-button--ghost:hover:not(:disabled) {
  background: var(--surface-raised);
  color: var(--text);
}

.base-button__spinner {
  width: 13px;
  height: 13px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    message: string
    type?: 'success' | 'error'
    duration?: number
  }>(),
  {
    type: 'success',
    duration: 3000,
  },
)

const model = defineModel<boolean>({ default: false })

const timer = ref<ReturnType<typeof setTimeout> | null>(null)

function clearTimer() {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
}

function closeSnackbar() {
  clearTimer()
  model.value = false
}

watch(
  () => [model.value, props.message, props.duration] as const,
  ([isVisible]) => {
    clearTimer()

    if (isVisible) {
      timer.value = setTimeout(() => {
        model.value = false
        timer.value = null
      }, props.duration)
    }
  },
)

onUnmounted(clearTimer)
</script>

<template>
  <Transition name="snackbar">
    <div
      v-if="model && message"
      class="snackbar"
      :class="`snackbar--${type}`"
      :role="type === 'error' ? 'alert' : 'status'"
      aria-live="polite"
    >
      <span class="snackbar__icon" aria-hidden="true">
        {{ type === 'success' ? '✓' : '!' }}
      </span>

      <p class="snackbar__message">
        {{ message }}
      </p>

      <button
        class="snackbar__close"
        type="button"
        aria-label="Close notification"
        @click="closeSnackbar"
      >
        ×
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.snackbar {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1000;

  display: flex;
  align-items: center;
  gap: 12px;

  width: max-content;
  max-width: calc(100vw - 32px);
  padding: 14px 16px;

  color: #f4f6fa;
  background: #151c29;
  border: 1px solid #354156;
  border-radius: 10px;
  box-shadow: 0 8px 30px rgb(0 0 0 / 30%);
}

.snackbar--success {
  border-left: 4px solid #4ade80;
}

.snackbar--error {
  border-left: 4px solid #f87171;
}

.snackbar__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 24px;
  height: 24px;
  border: 1px solid currentColor;
  border-radius: 50%;

  font-size: 14px;
  font-weight: 700;
}

.snackbar--success .snackbar__icon {
  color: #4ade80;
}

.snackbar--error .snackbar__icon {
  color: #f87171;
}

.snackbar__message {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.snackbar__close {
  flex-shrink: 0;
  padding: 0 4px;

  color: #a1aabd;
  background: transparent;
  border: none;

  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.snackbar__close:hover {
  color: #ffffff;
}

.snackbar__close:focus-visible {
  outline: 2px solid #80aaff;
  outline-offset: 3px;
  border-radius: 3px;
}

.snackbar-enter-active,
.snackbar-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.snackbar-enter-from,
.snackbar-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 480px) {
  .snackbar {
    right: 16px;
    bottom: 16px;
    left: 16px;
    width: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .snackbar-enter-active,
  .snackbar-leave-active {
    transition: none;
  }
}
</style>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  open: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function closeModal() {
  emit('close')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) {
    closeModal()
  }
}

let previousOverflow = ''

watch(
  () => props.open,
  (isOpen) => {
    if (typeof document === 'undefined') return

    if (isOpen) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = previousOverflow
    }
  },
  { immediate: true },
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)

  if (typeof document !== 'undefined') {
    document.body.style.overflow = previousOverflow
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'Image preview'"
        @click.self="closeModal"
      >
        <v-btn
          class="modal-close"
          icon="mdi-close"
          aria-label="Close modal"
          color="white"
          variant="tonal"
          size="large"
          @click="closeModal"
        />

        <v-card class="modal-container" color="transparent" flat>
          <div class="modal-content">
            <slot />
          </div>

          <div v-if="title" class="modal-caption">
            <span class="caption-indicator"></span>
            <p class="modal-title">{{ title }}</p>
          </div>

          <p class="modal-hint">
            Click outside or press ESC to close
          </p>
        </v-card>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 64px 24px 32px;

  background: rgba(3, 6, 12, 0.94);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.modal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;

  width: 100%;
  max-width: 1100px;
  max-height: 100%;
  overflow: visible;
}

.modal-content {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 0;
  max-height: 78vh;
}

.modal-content :deep(img) {
  display: block;

  max-width: 90vw;
  max-height: 78vh;

  width: auto;
  height: auto;

  object-fit: contain;
  border-radius: 10px;

  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.45);
}

.modal-content :deep(.modal-image-fallback) {
  color: #cbd5e1;
  font-size: 14px;
  text-align: center;
}

.modal-close {
  position: absolute;
  top: 24px;
  right: 28px;
  z-index: 2;

  border: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(30, 41, 59, 0.8);
  color: #fff;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.modal-close:hover {
  background: #334155;
  border-color: #64748b;
  transform: rotate(90deg);
}

.modal-close:focus-visible {
  outline: 2px solid #7dd3fc;
  outline-offset: 4px;
}

.modal-caption {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  max-width: 90vw;
}

.caption-indicator {
  flex-shrink: 0;

  width: 7px;
  height: 7px;

  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.6);
}

.modal-title {
  margin: 0;

  color: #f1f5f9;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-align: center;
  overflow-wrap: anywhere;
}

.modal-hint {
  margin: -8px 0 0;

  color: #64748b;
  font-size: 11px;
  letter-spacing: 0.04em;
  text-align: center;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.22s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition:
    transform 0.22s ease,
    opacity 0.22s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  opacity: 0;
  transform: scale(0.96);
}

@media (max-width: 600px) {
  .modal-overlay {
    padding: 64px 14px 24px;
  }

  .modal-close {
    top: 14px;
    right: 14px;
  }

  .modal-content {
    max-height: 75vh;
  }

  .modal-content :deep(img) {
    max-width: 94vw;
    max-height: 75vh;
    border-radius: 6px;
  }

  .modal-title {
    font-size: 14px;
  }

  .modal-hint {
    font-size: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .modal-enter-active .modal-container,
  .modal-leave-active .modal-container {
    transition: none;
  }

  .modal-enter-from .modal-container,
  .modal-leave-to .modal-container {
    transform: none;
  }
}
</style>

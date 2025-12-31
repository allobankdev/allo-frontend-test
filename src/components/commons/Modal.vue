<script setup lang="ts">
import { cn } from "@/core/libs/common";
import { cva, type VariantProps } from "class-variance-authority";
import { useAttrs } from "vue";

const modalVariants = cva(
  "bg-white rounded-2xl shadow-2xl w-full p-6 z-50 relative px-6 py-4",
  {
    variants: {
      size: {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        full: "max-w-full mx-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

type ModalVariants = VariantProps<typeof modalVariants>;

interface IProps {
  modelValue: boolean;
  title: string;
  size?: ModalVariants["size"];
  class?: string;
  showClose?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  showClose: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const attrs = useAttrs();

const closeModal = () => {
  emit("update:modelValue", false);
};

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeModal();
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-40 flex items-center justify-center px-4"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <Transition name="backdrop">
          <div v-if="modelValue" class="absolute inset-0 bg-black/50"></div>
        </Transition>

        <!-- Modal Content -->
        <div
          class="modal-content"
          :class="cn(modalVariants({ size }), attrs.class)"
          v-bind="attrs"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ title }}
            </h3>

            <button
              v-if="showClose"
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
              aria-label="Close modal"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="overflow-y-auto max-h-[70vh]">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="mt-6 pt-4 border-t border-gray-200">
            <slot name="footer" :close="closeModal" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal scale and fade animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .modal-content {
  transform: scale(0.9);
  opacity: 0;
}

.modal-enter-to {
  opacity: 1;
}

.modal-enter-to .modal-content {
  transform: scale(1);
  opacity: 1;
}

.modal-leave-from {
  opacity: 1;
}

.modal-leave-from .modal-content {
  transform: scale(1);
  opacity: 1;
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .modal-content {
  transform: scale(0.9);
  opacity: 0;
}

/* Backdrop fade */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.backdrop-enter-to,
.backdrop-leave-from {
  opacity: 1;
}
</style>

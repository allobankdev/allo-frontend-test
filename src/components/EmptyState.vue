<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    showGoBackButton?: boolean;
  }>(),
  {
    showGoBackButton: false,
  },
);

const emit = defineEmits<{
  goBack: [];
}>();
</script>
<template>
  <div
        class="flex min-h-[60vh] flex-col items-center justify-center text-center"
      >
        <div
          class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100"
        >
          <v-icon
            icon="mdi-rocket-launch-outline"
            size="28"
            class="text-gray-400"
          />
        </div>

        <slot name="message" />

        <button
          v-if="showGoBackButton"
          type="button"
          @click="emit('goBack')"
          class="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
        >
          Back to Rockets
        </button>
      </div>
</template>
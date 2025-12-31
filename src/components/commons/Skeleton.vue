<script setup lang="ts">
interface IProps {
  width?: string;
  height?: string;
  rounded?: string;
  class?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  width: "100%",
  height: "20px",
  rounded: "rounded-md",
});
</script>

<template>
  <div
    :class="['animate-pulse bg-gray-200', rounded, props.class]"
    :style="{ width: props.width, height: props.height }"
  ></div>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

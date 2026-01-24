<template>
  <div
    class="skeleton shimmer"
    :style="{
      width,
      height,
      borderRadius,
    }"
  />
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "420px",
  },
  borderRadius: {
    type: String,
    default: "12px",
  },
});
</script>

<style scoped>
.skeleton {
  background: #1f1f1f;
}

/* shimmer */
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>

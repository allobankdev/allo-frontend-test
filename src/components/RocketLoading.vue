<template>
  <div v-if="show" class="rocket-loading">
    <span class="rocket">🚀</span>
    <span class="text">
      {{ text }}<span class="dots">{{ dots }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

defineProps({
  text: {
    type: String,
    default: "Loading",
  },
  show: {
    type: Boolean,
    default: true,
  },
});

const dots = ref("");
let interval: any;

onMounted(() => {
  interval = setInterval(() => {
    dots.value = dots.value.length >= 3 ? "" : dots.value + ".";
  }, 400);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style scoped>
.rocket-loading {
  width: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 500;
}

.rocket {
  display: inline-block;
  animation: bounce 0.8s infinite;
}

.text {
  display: flex;
  align-items: center;
}

.dots {
  width: 20px;
  display: inline-block;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
</style>

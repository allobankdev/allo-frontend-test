<template>
  <div class="loading-wrapper">
    <!-- Animated rocket icon -->
    <div class="rocket-anim">
      <v-icon color="primary" size="52" class="pulse-icon">mdi-rocket-launch</v-icon>
      <div class="orbit-ring" />
    </div>

    <div class="loading-bar mt-6">
      <div class="loading-bar-fill" />
    </div>

    <p class="text-body-2 text-medium-emphasis mt-4 loading-message">{{ message }}</p>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{ message?: string }>(),
  { message: 'Memuat data roket…' },
)
</script>

<style scoped>
.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
}

.rocket-anim {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
}

.pulse-icon {
  animation: pulse-float 2s ease-in-out infinite;
  z-index: 1;
}

.orbit-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(79, 142, 247, 0.25);
  border-top-color: rgba(79, 142, 247, 0.8);
  animation: spin 1.4s linear infinite;
}

.loading-bar {
  width: 180px;
  height: 3px;
  background: rgba(255,255,255,0.08);
  border-radius: 2px;
  overflow: hidden;
}

.loading-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4F8EF7, #22D3EE);
  border-radius: 2px;
  animation: slide 1.6s ease-in-out infinite;
}

.loading-message {
  animation: fade-in 0.6s ease;
}

@keyframes pulse-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slide {
  0%   { transform: translateX(-100%); }
  50%  { transform: translateX(0); }
  100% { transform: translateX(100%); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>

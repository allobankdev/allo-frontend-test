<template>
  <div
    aria-hidden="true"
    class="starfield"
  >
    <div class="nebula" />
    <div class="stars stars--small" />
    <div class="stars stars--medium" />
    <div class="stars stars--large" />
  </div>
</template>

<script lang="ts" setup>
  // Purely decorative — no state or props needed.
</script>

<style scoped>
.starfield {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background: radial-gradient(ellipse at top, #131a4a 0%, #05060f 65%);
}

.nebula {
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(circle at 20% 30%, rgba(124, 92, 255, 0.28), transparent 40%),
    radial-gradient(circle at 80% 20%, rgba(0, 229, 255, 0.18), transparent 35%),
    radial-gradient(circle at 60% 85%, rgba(255, 110, 199, 0.14), transparent 40%);
  filter: blur(60px);
  animation: drift 50s ease-in-out infinite alternate;
}

.stars {
  position: absolute;
  inset: 0;
  background-repeat: repeat;
  animation: twinkle 6s ease-in-out infinite;
}

.stars--small {
  background-image:
    radial-gradient(1px 1px at 20px 30px, #fff, transparent),
    radial-gradient(1px 1px at 90px 120px, #fff, transparent),
    radial-gradient(1px 1px at 160px 60px, #fff, transparent),
    radial-gradient(1px 1px at 220px 180px, #fff, transparent),
    radial-gradient(1px 1px at 40px 200px, #fff, transparent);
  background-size: 250px 220px;
  opacity: 0.6;
}

.stars--medium {
  background-image:
    radial-gradient(1.5px 1.5px at 60px 90px, #fff, transparent),
    radial-gradient(1.5px 1.5px at 180px 40px, #fff, transparent),
    radial-gradient(1.5px 1.5px at 300px 160px, #fff, transparent);
  background-size: 350px 300px;
  opacity: 0.5;
  animation-delay: 2s;
}

.stars--large {
  background-image:
    radial-gradient(2px 2px at 100px 50px, #fff, transparent),
    radial-gradient(2px 2px at 260px 140px, #fff, transparent);
  background-size: 400px 380px;
  opacity: 0.85;
  animation-delay: 4s;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 1; }
}

@keyframes drift {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-5%, 5%) scale(1.15); }
}

@media (prefers-reduced-motion: reduce) {
  .nebula, .stars {
    animation: none;
  }
}
</style>

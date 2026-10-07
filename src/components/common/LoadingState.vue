<template>
  <div
    class="cyber-loading-container d-flex flex-column align-center justify-center py-8 py-md-16 px-4"
  >
    <!-- Futuristic Orbital Loader -->
    <div class="orbital-loader mb-6 mb-sm-8">
      <div class="ring ring-outer" />
      <div class="ring ring-inner" />
      <div class="core-icon">
        <v-icon
          icon="mdi-satellite-uplink"
          color="cyan-accent-3"
          size="36"
          class="pulse-icon"
        />
      </div>
    </div>

    <!-- HUD Text -->
    <div class="loading-text-wrapper text-cyan-accent-3">
      <span class="bracket text-grey-darken-1">[</span>
      <span class="status-text mx-1">{{ text }}</span>
      <span class="blinking-cursor">_</span>
      <span class="bracket text-grey-darken-1">]</span>
    </div>

    <div class="sub-text mt-2 text-grey">
      ESTABLISHING SECURE CONNECTION...
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: "PROCESSING DATA",
  },
});
</script>

<style scoped>
.cyber-loading-container {
  min-height: 200px;
  position: relative;
  z-index: 10;
  width: 100%;
}

/* --- Orbital Loader Animations --- */
.orbital-loader {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
}

.ring-outer {
  width: 100px;
  height: 100px;
  border-top: 2px solid #00e5ff;
  border-bottom: 2px solid rgba(0, 229, 255, 0.2);
  border-left: 2px solid rgba(0, 229, 255, 0.2);
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.2);
  animation: spinRight 2s linear infinite;
}

.ring-inner {
  width: 70px;
  height: 70px;
  border-right: 2px solid #00b8d4;
  border-left: 2px solid rgba(0, 184, 212, 0.2);
  border-top: 2px solid rgba(0, 184, 212, 0.2);
  animation: spinLeft 1.5s linear infinite;
}

.core-icon {
  position: absolute;
  z-index: 2;
}

.pulse-icon {
  animation: pulse-glow 2s ease-in-out infinite alternate;
}

/* --- Typography & Tech Details --- */
.loading-text-wrapper {
  font-family: "Space Mono", monospace;
  /* Font size responsif: minimum 0.8rem, ideal 4vw, maximum 1.1rem */
  font-size: clamp(0.8rem, 4vw, 1.1rem);
  font-weight: bold;
  letter-spacing: clamp(0.05em, 2vw, 0.15em);
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-wrap: wrap; /* Mencegah teks terpotong keluar layar */
}

.bracket {
  opacity: 0.7;
}

.status-text {
  word-break: break-word;
}

.blinking-cursor {
  display: inline-block;
  width: 10px;
  height: clamp(14px, 4vw, 18px);
  background-color: #00e5ff;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}

.sub-text {
  font-family: "Space Mono", monospace;
  /* Font responsif untuk subtext */
  font-size: clamp(0.55rem, 2.5vw, 0.7rem);
  letter-spacing: clamp(0.1em, 2vw, 0.2em);
  opacity: 0.6;
  text-align: center;
}

/* --- Responsive Media Queries --- */
@media (min-width: 600px) {
  .cyber-loading-container {
    min-height: 300px;
  }
}

/* Skala ulang loader untuk layar HP yang sangat sempit (< 400px) */
@media (max-width: 400px) {
  .orbital-loader {
    transform: scale(0.8);
  }
}

/* --- Keyframes --- */
@keyframes spinRight {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spinLeft {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes pulse-glow {
  0% {
    opacity: 0.6;
    filter: drop-shadow(0 0 2px #00e5ff);
  }
  100% {
    opacity: 1;
    filter: drop-shadow(0 0 10px #00e5ff);
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>

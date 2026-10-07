<template>
  <div
    class="cyber-error-container d-flex flex-column align-center justify-center py-12 px-4"
  >
    <!-- Holographic Alert Icon -->
    <div class="alert-icon-wrapper mb-8">
      <div class="danger-ring" />
      <div class="danger-ring inner-ring" />
      <v-icon
        icon="mdi-shield-alert-outline"
        color="red-accent-3"
        size="72"
        class="alert-icon"
      />
    </div>

    <!-- HUD Error Heading -->
    <div class="error-heading text-red-accent-3 mb-4 d-flex align-center">
      <span class="warning-bar mr-3" />
      CRITICAL UPLINK FAILURE
      <span class="warning-bar ml-3" />
    </div>

    <!-- Terminal Error Log -->
    <div class="error-terminal mb-8 pa-4">
      <div class="terminal-header d-flex align-center mb-3">
        <span class="dot red" />
        <span class="dot red-dim" />
        <span class="dot red-dim" />
        <span class="text-caption text-grey ml-3 terminal-title">SYS_ERR_LOG.TXT</span>
      </div>
      <div class="terminal-body text-body-2 text-center">
        <span class="text-grey-darken-1">> FATAL_EXCEPTION: </span>
        <span class="text-red-lighten-1">{{
          error || "UNKNOWN_TELEMETRY_ANOMALY"
        }}</span>
        <span class="blinking-cursor">_</span>
      </div>
    </div>

    <!-- Action Button -->
    <v-btn
      variant="outlined"
      color="red-accent-3"
      prepend-icon="mdi-power-cycle"
      size="large"
      class="cyber-retry-btn"
      @click="$emit('retry')"
    >
      REINITIALIZE CONNECTION
    </v-btn>
  </div>
</template>

<script setup lang="ts">
defineProps({
  error: {
    type: String,
    default: null,
  },
});

defineEmits(["retry"]);
</script>

<style scoped>
.cyber-error-container {
  position: relative;
  z-index: 10;
}

/* --- Holographic Icon --- */
.alert-icon-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.danger-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px dashed rgba(255, 82, 82, 0.4);
  border-radius: 50%;
  animation: spinRight 10s linear infinite;
}

.inner-ring {
  width: 75%;
  height: 75%;
  border: 1px solid rgba(255, 82, 82, 0.2);
  border-top: 2px solid #ff5252;
  animation: spinLeft 3s linear infinite;
}

.alert-icon {
  filter: drop-shadow(0 0 15px rgba(255, 82, 82, 0.6));
  animation: pulse-danger 2s ease-in-out infinite alternate;
}

/* --- Typography --- */
.error-heading {
  font-family: "Space Mono", monospace;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px rgba(255, 82, 82, 0.5);
}

.warning-bar {
  display: block;
  width: 30px;
  height: 2px;
  background-color: #ff5252;
  box-shadow: 0 0 8px #ff5252;
}

/* --- Terminal Error Log --- */
.error-terminal {
  background: rgba(20, 5, 5, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 82, 82, 0.2);
  border-left: 4px solid #ff5252;
  border-radius: 4px;
  min-width: 300px;
  max-width: 500px;
  box-shadow: inset 0 0 20px rgba(255, 82, 82, 0.05);
}

.terminal-title {
  font-family: "Space Mono", monospace;
  letter-spacing: 0.1em;
}

.terminal-body {
  font-family: "Space Mono", monospace;
  line-height: 1.6;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}

.dot.red {
  background-color: #ff5252;
  box-shadow: 0 0 5px #ff5252;
}
.dot.red-dim {
  background-color: rgba(255, 82, 82, 0.3);
}

.blinking-cursor {
  display: inline-block;
  width: 10px;
  background-color: #ff5252;
  margin-left: 4px;
  animation: blink 1s step-end infinite;
}

/* --- Action Button --- */
.cyber-retry-btn {
  font-family: "Space Mono", monospace;
  letter-spacing: 0.1em;
  font-weight: 700;
  background: rgba(255, 82, 82, 0.05);
  transition: all 0.3s ease;
}

.cyber-retry-btn:hover {
  background: rgba(255, 82, 82, 0.15);
  box-shadow: 0 0 20px rgba(255, 82, 82, 0.3);
  transform: translateY(-2px);
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

@keyframes pulse-danger {
  0% {
    opacity: 0.7;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1.05);
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

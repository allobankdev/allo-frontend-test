<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const onClickButtonRocket = () => {
  router.push("/rocket");
};
</script>

<template>
  <div class="landing-root">
    <div class="blob blob-blue" />
    <div class="blob blob-purple" />

    <v-container class="content" fluid>
      <div class="logo">
        <v-icon icon="mdi-rocket-launch" size="48" class="logo-icon" />
      </div>

      <div class="title-wrapper">
        <h1 class="title">Space<span class="accent">X</span></h1>
        <p class="subtitle">Mission Control Explorer</p>
      </div>

      <v-btn
        rounded="xl"
        size="x-large"
        color="white"
        class="enter-btn"
        @click="onClickButtonRocket()"
      >
        Rockets
        <v-icon end icon="mdi-arrow-right" />
      </v-btn>

      <p class="stardate">CREATED: 23.01.2026</p>
    </v-container>
  </div>
</template>

<style scoped>
.landing-root {
  position: fixed;
  inset: 0;
  background: #0b0d17;
  overflow: hidden;
}

.blob {
  position: absolute;
  width: 24rem;
  height: 24rem;
  border-radius: 50%;
  filter: blur(120px);
  animation: pulse 4s ease-in-out infinite;
}

.blob-blue {
  top: 25%;
  left: 25%;
  background: rgba(37, 99, 235, 0.1);
}

.blob-purple {
  bottom: 25%;
  right: 25%;
  background: rgba(147, 51, 234, 0.1);
  animation-delay: 1s;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.content {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 2rem;
}

.logo {
  width: 96px;
  height: 96px;
  border-radius: 24px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
  transition: transform 0.5s;
}

.logo:hover {
  transform: scale(1.1);
}

.logo-icon {
  color: white;
  transform: rotate(-45deg);
}

.title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  font-style: italic;
  color: white;
}

.accent {
  color: #3b82f6;
}

.subtitle {
  color: #9ca3af;
  font-family: monospace;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.enter-btn {
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding-inline: 2rem;
}

.enter-btn:hover {
  background-color: #3b82f6 !important;
  color: white !important;
}

.stardate {
  margin-top: 3rem;
  font-size: 0.75rem;
  font-family: monospace;
  color: #6b7280;
}
</style>

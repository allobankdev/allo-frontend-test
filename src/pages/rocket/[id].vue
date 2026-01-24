<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRocketStore } from "@/stores/rocket.store";
import SkeletonLoading from "@/modules/Rocket/SkeletonLoading.vue";

const route = useRoute();
const store = useRocketStore();

const { id } = route.params as { id: string };

onMounted(() => {
  store.fetchRocket(id);
});

const firstFlight = computed(() => {
  if (!store.selectedRocket) return "";
  return store.selectedRocket.first_flight;
});

const onClickRetry = () => {
  store.fetchRocket(id);
};
</script>

<template>
  <!-- Loading -->
  <v-container v-if="store.loading">
    <skeleton-loading height="520px" />
  </v-container>

  <v-container v-else-if="store.error" fluid class="error-root">
    <div class="error-glow" />

    <div class="error-content">
      <v-icon icon="mdi-alert-octagon-outline" size="96" class="error-icon" />

      <h1 class="error-title">Mission Failed</h1>
      <p class="error-subtitle">
        We lost contact with the rocket. Please retry the launch sequence.
      </p>

      <v-btn
        rounded="xl"
        size="x-large"
        class="retry-btn"
        @click="onClickRetry"
      >
        Retry Mission
        <v-icon end icon="mdi-refresh" />
      </v-btn>
    </div>
  </v-container>

  <!-- Detail -->
  <div v-else-if="store.selectedRocket">
    <!-- HERO BACKGROUND -->
    <div
      class="hero-bg"
      :style="{
        backgroundImage: `url(${store.selectedRocket.flickr_images[0]})`,
      }"
    >
      <div class="hero-overlay" />

      <v-container class="hero-content">
        <v-row>
          <v-col cols="12" md="8">
            <h1 class="text-h3 font-weight-bold text-white">
              {{ store.selectedRocket.name }}
            </h1>

            <p class="text-body-1 text-white opacity-80 mt-4 max-w">
              {{ store.selectedRocket.description }}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- CONTENT -->
    <v-container class="py-10">
      <v-row>
        <v-col cols="12" md="8">
          <h2 class="text-h6 font-weight-medium mb-4">Rocket Information</h2>

          <v-divider class="mb-6" />

          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="info-item">
                <span class="label">Country</span>
                <span class="value">{{ store.selectedRocket.country }}</span>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="info-item">
                <span class="label">Cost per launch</span>
                <span class="value">
                  ${{ store.selectedRocket.cost_per_launch.toLocaleString() }}
                </span>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="info-item">
                <span class="label">First flight</span>
                <span class="value">
                  {{ firstFlight }}
                </span>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.hero-bg {
  position: relative;
  min-height: 520px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.25),
    rgba(0, 0, 0, 0.85)
  );
}

.hero-content {
  position: relative;
  padding-top: 160px;
  padding-bottom: 120px;
}

.max-w {
  max-width: 720px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 0;
}

.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: white;
}

.value {
  font-size: 1rem;
  font-weight: 500;
}

.error-root {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  overflow: hidden;
}

.error-glow {
  position: absolute;
  width: 22rem;
  height: 22rem;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.12);
  filter: blur(120px);
  animation: pulse 3s ease-in-out infinite;
}

.error-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 420px;
  padding: 2rem;
}

.error-icon {
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: white;
}

.error-subtitle {
  margin-top: 0.75rem;
  font-size: 0.95rem;
  color: #9ca3af;
  line-height: 1.6;
}

.retry-btn {
  margin-top: 2rem;
  background: white;
  color: #111827;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding-inline: 2.5rem;
}

.retry-btn:hover {
  background: #ef4444 !important;
  color: white !important;
}
</style>

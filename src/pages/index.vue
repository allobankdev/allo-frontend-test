<template>
  <v-container
    fluid
    class="command-center pa-0"
  >
    <div class="stars-bg" />

    <section class="hero-panel d-flex align-center">
      <!-- Efek Scanline untuk menambah kesan monitor cyber -->
      <div class="scanlines" />

      <v-container
        max-width="1200"
        class="position-relative z-index-2"
      >
        <v-row align="center">
          <!-- Kolom Kiri: Teks (Diperbarui lebarnya jadi md="7") -->
          <v-col
            cols="12"
            md="7"
            class="hero-content"
          >
            <div class="system-status mb-4">
              <span class="pulse-dot" /> SYSTEM ONLINE / DB_VER_2026
              <span class="ms-4 text-grey-darken-1">| AUTH: ADMIN</span>
            </div>

            <h1 class="hero-title text-white">
              ROCKET <br>
              <span
                class="text-cyan title-glitch"
                data-text="ARCHIVE"
              >ARCHIVE</span>
            </h1>

            <div class="hero-decorator my-4" />

            <p class="hero-subtitle text-grey-lighten-1">
              Advanced index of orbital launch vehicles, flight telemetry, and
              engineered systems built to break gravity.
            </p>

            <div class="mt-8 d-flex align-center gap-4">
              <AddRocketDialog @add="addRocket" />
              <div class="barcode d-none d-sm-block ms-6" />
            </div>
          </v-col>

          <!-- Kolom Kanan: HUD / Dekorasi Cyber -->
          <v-col
            cols="12"
            md="5"
            class="d-none d-md-flex justify-center align-center position-relative"
          >
            <div class="cyber-hud">
              <div class="hud-ring outer-ring" />
              <div class="hud-ring inner-ring" />
              <div class="hud-core">
                <v-icon
                  icon="mdi-rocket-launch"
                  color="cyan"
                  size="48"
                  class="rocket-icon"
                />
              </div>
              <div class="hud-data text-cyan text-caption font-space-mono">
                <div>TRJ: NOMINAL</div>
                <div>ALT: 408km</div>
                <div>SPD: 7.66km/s</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <div class="cyber-grid" />
    </section>

    <v-container
      max-width="1200"
      class="content-wrap px-4 px-md-6 py-12"
    >
      <div
        class="d-flex flex-column flex-md-row justify-space-between align-md-end mb-8 border-b-cyan pb-4"
      >
        <div>
          <div class="text-cyan font-space-mono text-caption mb-1">
            01 / AVAILABLE VEHICLES
          </div>
          <h2 class="text-h4 font-weight-bold text-white">
            Fleet Inventory
          </h2>
        </div>
        <div class="text-grey font-space-mono mt-4 mt-md-0">
          DATA MATCH:
          {{ filteredRockets.length.toString().padStart(2, "0") }} UNITS
        </div>
      </div>

      <v-row class="mb-8">
        <v-col
          cols="12"
          md="6"
        >
          <RocketFilter
            v-model="searchQuery"
            class="cyber-search"
          />
        </v-col>
      </v-row>

      <ErrorState
        v-if="state.error"
        :error="state.error"
        @retry="retryFetch"
      />
      <LoadingState
        v-else-if="state.isLoading"
        text="Establishing uplink... Fetching data"
      />

      <template v-else>
        <div
          v-if="filteredRockets.length === 0"
          class="empty-state text-center py-12"
        >
          <v-icon
            icon="mdi-radar"
            size="80"
            color="cyan-darken-3"
            class="mb-6 pulse-anim"
          />
          <div class="text-h5 text-white font-weight-light">
            No telemetries found.
          </div>
          <div class="text-grey mt-2">
            Adjust your search parameters.
          </div>
        </div>

        <v-row
          v-else
          class="rocket-grid"
        >
          <v-col
            v-for="rocket in filteredRockets"
            :key="rocket.id"
            cols="12"
            sm="6"
            md="4"
            class="gsap-rocket-item"
          >
            <RocketCard :rocket="rocket" />
          </v-col>
        </v-row>
      </template>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from "vue";
import gsap from "gsap";
import { useRockets } from "../composables/useRockets";
import RocketCard from "../components/rockets/RocketCard.vue";
import RocketFilter from "../components/rockets/RocketFilter.vue";
import AddRocketDialog from "../components/rockets/AddRocketDialog.vue";
import LoadingState from "../components/common/LoadingState.vue";
import ErrorState from "../components/common/ErrorState.vue";

const {
  state,
  searchQuery,
  fetchRockets,
  retryFetch,
  filteredRockets,
  addRocket,
} = useRockets();

const animateGrid = () => {
  nextTick(() => {
    gsap.fromTo(
      ".gsap-rocket-item",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
    );
  });
};

onMounted(async () => {
  // Hero Animation
  gsap.fromTo(
    ".hero-content > *",
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" },
  );

  await fetchRockets();
});

watch(filteredRockets, () => {
  if (filteredRockets.value.length > 0 && !state.isLoading) {
    animateGrid();
  }
});
</script>

<style scoped>
/* --- Tambahan Aksen Typo & Garis --- */
.hero-decorator {
  width: 60px;
  height: 4px;
  background: #00e5ff;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  border-radius: 2px;
}

.barcode {
  height: 36px;
  width: 120px;
  background: linear-gradient(
    90deg,
    rgba(0, 229, 255, 0.4) 0%,
    rgba(0, 229, 255, 0.4) 5%,
    transparent 5%,
    transparent 10%,
    rgba(0, 229, 255, 0.4) 10%,
    rgba(0, 229, 255, 0.4) 20%,
    transparent 20%,
    transparent 25%,
    rgba(0, 229, 255, 0.4) 25%,
    rgba(0, 229, 255, 0.4) 28%,
    transparent 28%,
    transparent 35%,
    rgba(0, 229, 255, 0.4) 35%,
    rgba(0, 229, 255, 0.4) 50%,
    transparent 50%,
    transparent 55%,
    rgba(0, 229, 255, 0.4) 55%,
    rgba(0, 229, 255, 0.4) 60%,
    transparent 60%,
    transparent 70%,
    rgba(0, 229, 255, 0.4) 70%,
    rgba(0, 229, 255, 0.4) 75%,
    transparent 75%,
    transparent 85%,
    rgba(0, 229, 255, 0.4) 85%,
    rgba(0, 229, 255, 0.4) 100%
  );
  opacity: 0.5;
}

/* --- Efek Layar Monitor (Scanlines) --- */
.scanlines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0) 50%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.1)
  );
  background-size: 100% 4px;
  z-index: 1;
  pointer-events: none;
}

/* --- Dekorasi HUD (Heads Up Display) Kanan --- */
.cyber-hud {
  position: relative;
  width: 250px;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hud-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(0, 229, 255, 0.3);
}

.outer-ring {
  width: 100%;
  height: 100%;
  border-top: 2px solid #00e5ff;
  border-bottom: 2px solid #00e5ff;
  animation: spin 12s linear infinite;
}

.inner-ring {
  width: 70%;
  height: 70%;
  border-left: 2px dashed #00e5ff;
  border-right: 2px dashed #00e5ff;
  animation: spin-reverse 8s linear infinite;
}

.hud-core {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(0, 229, 255, 0.05);
  box-shadow: inset 0 0 20px rgba(0, 229, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.rocket-icon {
  animation: float 3s ease-in-out infinite;
}

.hud-data {
  position: absolute;
  right: -40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(6, 9, 19, 0.8);
  padding: 8px 12px;
  border-left: 2px solid #00e5ff;
}

/* --- Animasi --- */
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes spin-reverse {
  100% {
    transform: rotate(-360deg);
  }
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.command-center {
  min-height: 100vh;
  background-color: #060913;
  color: #ffffff;
  position: relative;
  overflow: hidden;
}

.stars-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0, 0, 0, 0)),
    radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0, 0, 0, 0));
  background-size: 200px 200px;
  opacity: 0.3;
  z-index: 0;
}

.hero-panel {
  position: relative;
  min-height: 50vh;
  background: radial-gradient(
    circle at 80% 50%,
    rgba(0, 229, 255, 0.08) 0%,
    transparent 60%
  );
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
}

.cyber-grid {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background-image:
    linear-gradient(transparent 95%, rgba(0, 229, 255, 0.2) 100%),
    linear-gradient(90deg, transparent 95%, rgba(0, 229, 255, 0.2) 100%);
  background-size: 30px 30px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: bottom;
  opacity: 0.4;
}

.system-status {
  font-family: "Space Mono", monospace;
  font-size: 0.75rem;
  color: #00e5ff;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #00e5ff;
  border-radius: 50%;
  margin-right: 12px;
  box-shadow:
    0 0 10px #00e5ff,
    0 0 20px #00e5ff;
  animation: pulse 1.5s infinite alternate;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.hero-title {
  font-size: clamp(3rem, 7vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.text-cyan {
  color: #00e5ff !important;
  text-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
}

.hero-subtitle {
  max-width: 480px;
  font-size: 1.1rem;
  line-height: 1.6;
}

.border-b-cyan {
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
}

.font-space-mono {
  font-family: "Space Mono", monospace;
}

.empty-state {
  border: 1px dashed rgba(0, 229, 255, 0.2);
  border-radius: 16px;
  background: rgba(16, 20, 31, 0.4);
}

.pulse-anim {
  animation: pulse 2s infinite alternate;
}
</style>

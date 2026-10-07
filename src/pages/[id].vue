<template>
  <div class="detail-wrapper">
    <v-container
      max-width="1000"
      class="py-8 position-relative z-index-2"
    >
      <v-btn
        variant="text"
        prepend-icon="mdi-chevron-left"
        class="mb-6 px-0 text-cyan back-btn"
        @click="$router.push('/')"
      >
        RETURN TO ARCHIVE
      </v-btn>

      <ErrorState
        v-if="error"
        :error="error"
        @retry="loadRocket"
      />
      <LoadingState
        v-else-if="isLoading"
        text="Decrypting rocket blueprints..."
      />

      <div
        v-else-if="rocket"
        class="content-anim"
      >
        <v-card
          class="cyber-panel overflow-hidden"
          elevation="0"
        >
          <div class="image-hero-container">
            <v-img
              :src="imageSource"
              :alt="`${rocket.full_name} rocket image`"
              height="500"
              cover
              class="hero-img"
              @error="useFallbackImage"
            />
            <div class="hero-overlay" />
            <div class="hero-content pa-6 pa-md-10">
              <v-chip
                v-if="rocket.manufacturer?.country_code"
                color="cyan-accent-4"
                variant="outlined"
                class="mb-4 bg-blur"
                size="small"
              >
                <v-icon
                  start
                  icon="mdi-crosshairs-gps"
                  size="small"
                />
                ORIGIN: {{ rocket.manufacturer.country_code }}
              </v-chip>
              <h1 class="text-h2 font-weight-black text-white mb-2 text-glow">
                {{ rocket.full_name }}
              </h1>
              <div class="text-h6 text-cyan font-space-mono">
                CLASS: {{ rocket.name }}
              </div>
            </div>
          </div>

          <v-card-text class="pa-6 pa-md-10 bg-dark-glass">
            <p class="text-body-1 text-grey-lighten-1 mb-10 description-text">
              {{
                rocket.description ||
                  "No telemetry description available in current database."
              }}
            </p>

            <v-row class="stat-row">
              <v-col
                cols="12"
                sm="6"
              >
                <div class="stat-card">
                  <v-icon
                    icon="mdi-currency-usd"
                    color="cyan-accent-3"
                    size="32"
                    class="mb-3"
                  />
                  <div class="text-caption text-grey font-space-mono mb-1">
                    LAUNCH COST
                  </div>
                  <div class="text-h5 text-white font-weight-bold">
                    {{ formatCost(rocket.launch_cost) }}
                  </div>
                </div>
              </v-col>

              <v-col
                cols="12"
                sm="6"
              >
                <div class="stat-card">
                  <v-icon
                    icon="mdi-rocket-launch"
                    color="purple-accent-2"
                    size="32"
                    class="mb-3"
                  />
                  <div class="text-caption text-grey font-space-mono mb-1">
                    MAIDEN FLIGHT
                  </div>
                  <div class="text-h5 text-white font-weight-bold">
                    {{ formatDate(rocket.maiden_flight) }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import gsap from "gsap";
import { useRocketDetail } from "../composables/useRocketDetail";
import LoadingState from "../components/common/LoadingState.vue";
import ErrorState from "../components/common/ErrorState.vue";
import { useRocketStore } from "../store/rocketStore";

const route = useRoute();
const { rocket, isLoading, error, fetchRocket } = useRocketDetail();
const store = useRocketStore();
const fallbackImage = "/rocket-fallback.svg";
const imageSource = ref(fallbackImage);

const runAnimations = () => {
  nextTick(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      ".back-btn",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5 },
    )
      .fromTo(
        ".cyber-panel",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.3",
      )
      .fromTo(
        ".hero-content > *",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
        "-=0.2",
      )
      .fromTo(
        ".description-text",
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.2",
      )
      .fromTo(
        ".stat-card",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          duration: 0.5,
          ease: "back.out(1.5)",
        },
        "-=0.2",
      );
  });
};

const loadRocket = async () => {
  const id = route.params.id as string;
  const localRocket =
    store.getLocalRocket(id) ||
    store.rockets.find(
      (r) => r.id.toString() === id && r.manufacturer?.country_code === "Local",
    );

  if (localRocket) {
    rocket.value = localRocket;
  } else {
    await fetchRocket(id);
  }
  imageSource.value = rocket.value?.image_url || fallbackImage;
};

const useFallbackImage = () => {
  imageSource.value = fallbackImage;
};

watch(
  () => isLoading.value,
  (newVal) => {
    if (!newVal && rocket.value) runAnimations();
  },
);

onMounted(() => {
  loadRocket();
});

const formatCost = (cost: string | null) => {
  if (!cost) return "Classified";
  const num = Number(cost);
  if (isNaN(num)) return cost;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Classified";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date);
};
</script>

<style scoped>
.detail-wrapper {
  min-height: 100vh;
  background-color: #060913;
  background-image: radial-gradient(
    circle at top right,
    rgba(0, 229, 255, 0.05) 0%,
    transparent 40%
  );
}

.text-cyan {
  color: #00e5ff !important;
}

.font-space-mono {
  font-family: "Space Mono", monospace;
  letter-spacing: 0.1em;
}

.cyber-panel {
  background: transparent !important;
  border: 1px solid rgba(0, 229, 255, 0.2) !important;
  border-radius: 24px !important;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset !important;
}

.image-hero-container {
  position: relative;
  width: 100%;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(10, 14, 23, 0.6) 50%,
    rgba(10, 14, 23, 1) 100%
  );
}

.hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 2;
}

.bg-blur {
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.4);
}

.text-glow {
  text-shadow: 0 0 30px rgba(0, 229, 255, 0.4);
}

.bg-dark-glass {
  background: rgba(10, 14, 23, 1);
}

.description-text {
  line-height: 1.8;
  font-size: 1.1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  height: 100%;
}

.stat-card:hover {
  background: rgba(0, 229, 255, 0.05);
  border-color: rgba(0, 229, 255, 0.3);
  transform: translateY(-4px);
}
</style>

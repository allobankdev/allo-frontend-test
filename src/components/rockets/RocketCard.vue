<template>
  <v-card
    class="h-100 d-flex flex-column futuristic-card"
    elevation="0"
    @click="$router.push(`/${rocket.id}`)"
  >
    <div class="image-wrapper">
      <v-img
        :src="imageSource"
        :alt="`${rocket.full_name} rocket image`"
        height="240"
        cover
        class="rocket-image"
        @error="useFallbackImage"
      >
        <template #placeholder>
          <div
            class="d-flex align-center justify-center fill-height glass-overlay"
          >
            <v-progress-circular
              color="cyan-accent-3"
              indeterminate
            />
          </div>
        </template>
        <div class="image-gradient-overlay" />
      </v-img>
      <div class="tech-badge">
        ID-{{ String(rocket.id).slice(-3).padStart(3, "0") }}
      </div>
    </div>

    <v-card-item class="pt-5 pb-2">
      <v-card-title
        class="text-h6 font-weight-bold text-white text-uppercase tracking-wide"
      >
        {{ rocket.full_name }}
      </v-card-title>
      <v-card-subtitle class="cyan-text mt-1 font-weight-medium">
        {{ rocket.name }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="flex-grow-1 pt-2">
      <p
        class="text-body-2 text-grey-lighten-1 text-truncate-3 card-description"
      >
        {{ rocket.description || "No description available." }}
      </p>
    </v-card-text>

    <div class="card-footer px-4 py-4 mt-auto">
      <v-btn
        color="cyan-accent-4"
        variant="outlined"
        block
        class="explore-btn"
        prepend-icon="mdi-rocket-launch-outline"
      >
        EXPLORE SYSTEM
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { PropType } from "vue";
import type { Rocket } from "../../types/rocket";

const fallbackImage = "/rocket-fallback.svg";

const props = defineProps({
  rocket: {
    type: Object as PropType<Rocket>,
    required: true,
  },
});
const imageSource = ref(props.rocket.image_url || fallbackImage);

const useFallbackImage = () => {
  imageSource.value = fallbackImage;
};
</script>

<style scoped>
.futuristic-card {
  background: rgba(16, 20, 31, 0.6) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 229, 255, 0.15) !important;
  border-radius: 16px !important;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  cursor: pointer;
}

.futuristic-card:hover {
  transform: translateY(-8px);
  border-color: rgba(0, 229, 255, 0.5) !important;
  box-shadow: 0 12px 32px rgba(0, 229, 255, 0.15) !important;
}

.image-wrapper {
  position: relative;
}

.image-gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, rgba(16, 20, 31, 1), transparent);
}

.tech-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 229, 255, 0.3);
  color: #00e5ff;
  padding: 4px 10px;
  border-radius: 4px;
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  backdrop-filter: blur(4px);
}

.tracking-wide {
  letter-spacing: 0.05em;
}

.cyan-text {
  color: #00e5ff !important;
  letter-spacing: 0.08em;
  font-family: "Space Mono", monospace;
  font-size: 0.8rem;
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
}

.explore-btn {
  border-radius: 8px;
  letter-spacing: 0.1em;
  font-family: "Space Mono", monospace;
  font-weight: 600;
  transition: all 0.3s ease;
}

.futuristic-card:hover .explore-btn {
  background: rgba(0, 229, 255, 0.1);
  color: #ffffff !important;
}
</style>

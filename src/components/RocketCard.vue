<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Launcher } from '../services/launcherApi'

const props = defineProps<{
  launcher: Launcher
}>()

const emit = defineEmits<{
  'view-details': [id: number]
}>()

const imageFailed = ref(false)

watch(
  () => props.launcher.image_url,
  () => {
    imageFailed.value = false
  },
)
</script>

<template>
  <article class="launcher-card">
    <div class="image-wrapper">
      <img
        v-if="launcher.image_url && !imageFailed"
        :src="launcher.image_url"
        :alt="launcher.name || 'Rocket image'"
        loading="lazy"
        @error="imageFailed = true"
      />

      <div v-else class="image-placeholder">
        <span>SPACE<span class="accent">X</span></span>
        <span class="placeholder-caption">
          No image available
        </span>
      </div>
    </div>

    <div class="card-content">
      <p class="manufacturer">
        {{ launcher.manufacturer?.name || 'SpaceX' }}
      </p>

      <h3>{{ launcher.full_name || launcher.name }}</h3>

      <p class="card-description">
        {{ launcher.description || 'No description available.' }}
      </p>

      <div class="card-footer">
        <span class="country">
          {{
            launcher.manufacturer?.country_code ||
            'Country unavailable'
          }}
        </span>

        <button
          class="detail-button"
          type="button"
          @click="emit('view-details', launcher.id)"
        >
          View Details
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.launcher-card {
  min-width: 0;
  overflow: hidden;
  background: #111621;
  border: 1px solid #252d3c;
  border-radius: 12px;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.launcher-card:hover {
  transform: translateY(-4px);
  border-color: #668bd0;
}

.image-wrapper {
  height: 210px;
  overflow: hidden;
  background: #202736;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.image-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #aab7ce;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 3px;
}

.accent {
  color: #80aaff;
}

.placeholder-caption {
  color: #7f8ba1;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0;
}

.card-content {
  padding: 22px;
}

.manufacturer {
  margin: 0 0 10px;
  color: #8eaeea;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.card-content h3 {
  margin: 0 0 12px;
  font-size: 23px;
}

.card-description {
  min-height: 66px;
  margin: 0;
  color: #a1aabd;
  font-size: 13px;
  line-height: 1.7;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.card-footer {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 14px;
}

.country {
  color: #9ba6ba;
  font-size: 12px;
}

.detail-button {
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #e9efff;
  color: #101725;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;
}

.detail-button:hover {
  background: #cbdcff;
}

.detail-button:focus-visible {
  outline: 2px solid #80aaff;
  outline-offset: 3px;
}

@media (max-width: 560px) {
  .image-wrapper {
    height: 220px;
  }

  .card-content h3 {
    font-size: 21px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .launcher-card,
  .detail-button {
    transition: none;
  }

  .launcher-card:hover {
    transform: none;
  }
}
</style>
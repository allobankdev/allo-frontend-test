<template>
  <div
    class="rocket-card glass-card"
    :class="{ 'rocket-card--local': rocket.isLocal }"
    @click="navigate"
  >
    <!-- Image -->
    <div class="rocket-card__img-wrap">
      <img
        v-if="rocket.image_url"
        :src="rocket.image_url"
        :alt="rocket.full_name"
        class="rocket-card__img"
        loading="lazy"
        @error="imgError = true"
      />
      <div v-if="!rocket.image_url || imgError" class="rocket-card__img-fallback">
        <v-icon size="56" color="primary" style="opacity:0.35">mdi-rocket</v-icon>
      </div>

      <!-- Badges -->
      <div class="rocket-card__badges">
        <v-chip
          v-if="rocket.isLocal"
          color="secondary"
          size="x-small"
          variant="elevated"
          prepend-icon="mdi-plus-circle"
          class="font-weight-bold"
        >
          Baru
        </v-chip>
        <v-chip
          v-if="rocket.manufacturer?.country_code"
          color="surface"
          size="x-small"
          variant="elevated"
          class="font-weight-medium ml-1"
        >
          🌍 {{ rocket.manufacturer.country_code }}
        </v-chip>
      </div>
    </div>

    <!-- Content -->
    <div class="rocket-card__body">
      <h3 class="rocket-card__title" :title="rocket.full_name">
        {{ rocket.full_name || '–' }}
      </h3>

      <p class="rocket-card__desc">
        {{ descriptionText }}
      </p>

      <!-- Stats row -->
      <div class="rocket-card__stats">
        <div class="rocket-card__stat">
          <v-icon size="14" color="secondary">mdi-calendar-star</v-icon>
          <span>{{ formatDate(rocket.maiden_flight) }}</span>
        </div>
        <div class="rocket-card__stat">
          <v-icon size="14" color="warning">mdi-currency-usd</v-icon>
          <span>{{ formatCost(rocket.launch_cost) }}</span>
        </div>
      </div>
    </div>

    <!-- Hover arrow -->
    <div class="rocket-card__arrow">
      <v-icon color="primary" size="18">mdi-arrow-right</v-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'
import { formatDate, formatCost, truncate } from '@/utils/formatters'

const props = defineProps<{ rocket: Rocket }>()
const router = useRouter()
const imgError = ref(false)

const descriptionText = computed(() =>
  props.rocket.description
    ? truncate(props.rocket.description, 110)
    : 'Tidak ada deskripsi tersedia.',
)

function navigate() {
  router.push({ name: 'rocket-detail', params: { id: props.rocket.id } })
}
</script>

<style scoped>
.rocket-card {
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  user-select: none;
}

.rocket-card--local {
  border-color: rgba(34, 211, 238, 0.3) !important;
  box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.15) !important;
}

/* ── Image ── */
.rocket-card__img-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #111827, #1A2235);
  flex-shrink: 0;
}

.rocket-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.rocket-card:hover .rocket-card__img {
  transform: scale(1.06);
}

.rocket-card__img-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rocket-card__badges {
  position: absolute;
  top: 10px;
  left: 10px;
}

/* ── Body ── */
.rocket-card__body {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rocket-card__title {
  font-size: 1rem;
  font-weight: 700;
  color: #E2E8F0;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rocket-card__desc {
  font-size: 0.8rem;
  color: rgba(226, 232, 240, 0.55);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.rocket-card__stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.rocket-card__stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: rgba(226, 232, 240, 0.6);
}

/* ── Arrow ── */
.rocket-card__arrow {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(79, 142, 247, 0.12);
  border: 1px solid rgba(79, 142, 247, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.rocket-card:hover .rocket-card__arrow {
  opacity: 1;
  transform: translateX(0);
}
</style>

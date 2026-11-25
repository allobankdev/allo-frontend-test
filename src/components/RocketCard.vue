<!--
  Fungsi: Kartu buat satu roket di halaman list. Nampilin gambar, badge ID/negara atau
          Custom, nama roket, deskripsi singkat, dan kalau diklik langsung ke `/rockets/:id`.
  Props:
    - rocket: data roket yang udah dirapihin
  Dipakai di:
    - src/pages/index.vue
-->

<script setup lang="ts">
import type { Rocket } from '@/types/rocket'
import RocketImage from './RocketImage.vue'

defineProps<{
  rocket: Rocket
}>()
</script>

<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    variant="flat"
    rounded="lg"
    class="rocket-card d-flex flex-column h-100"
  >
    <div class="media-frame">
      <RocketImage
        :src="rocket.imageUrl"
        :alt="rocket.name"
        height="220px"
      />
      <div
        class="media-vignette"
        aria-hidden="true"
      />

      <!-- HUD Reticle Corners -->
      <span
        class="hud-corner tl"
        aria-hidden="true"
      />
      <span
        class="hud-corner tr"
        aria-hidden="true"
      />

      <!-- Top Overlay Telemetry -->
      <div class="media-top d-flex align-center justify-space-between">
        <span class="id-chip font-mono">
          {{ rocket.isLocal ? 'LOCAL' : `CFG-${rocket.id}` }}
        </span>
        <span
          v-if="rocket.isLocal"
          class="status-pill pill-amber font-mono"
        >CUSTOM</span>
        <span
          v-else-if="rocket.countryCode"
          class="status-pill pill-cyan font-mono"
        >
          {{ rocket.countryCode }}
        </span>
      </div>
    </div>

    <div class="pa-5 d-flex flex-column flex-grow-1">
      <h2 class="font-display rocket-title mb-2">
        {{ rocket.name }}
      </h2>

      <p class="rocket-desc mb-5">
        {{ rocket.description ?? 'No mission brief available for this launch vehicle.' }}
      </p>

      <div class="card-footer mt-auto pt-3 d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-2">
          <span
            class="telemetry-bar"
            aria-hidden="true"
          />
          <span class="font-mono footer-meta">
            {{ rocket.firstFlight ? `FLIGHT ${rocket.firstFlight.slice(0, 4)}` : 'FLIGHT TBD' }}
          </span>
        </div>

        <span class="inspect-link font-mono d-inline-flex align-center ga-1">
          INSPECT
          <v-icon
            icon="mdi-chevron-right"
            size="16"
            class="arrow-icon"
          />
        </span>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.rocket-card {
  background-color: var(--hull);
  border: 1px solid var(--line);
  transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-3px);
  background-color: var(--console);
  border-color: var(--line-active);
}

.media-frame {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--line);
}

.media-frame :deep(img) {
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.rocket-card:hover .media-frame :deep(img) {
  transform: scale(1.04);
}

.media-vignette {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(14, 15, 17, 0.45) 0%,
    transparent 35%,
    rgba(22, 24, 28, 0.85) 100%
  );
  pointer-events: none;
}

.hud-corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: rgba(255, 255, 255, 0.28);
  border-style: solid;
  transition: border-color 0.2s ease;
  pointer-events: none;
}

.hud-corner.tl { top: 8px; left: 8px; border-width: 1.5px 0 0 1.5px; }
.hud-corner.tr { top: 8px; right: 8px; border-width: 1.5px 1.5px 0 0; }

.rocket-card:hover .hud-corner {
  border-color: var(--accent);
}

.media-top {
  position: absolute;
  top: 12px;
  left: 14px;
  right: 14px;
}

.id-chip,
.status-pill {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  border-radius: 4px;
}

.id-chip {
  color: var(--ink);
  background: rgba(14, 15, 17, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.pill-cyan {
  background: rgba(14, 15, 17, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: var(--ink);
}

.pill-amber {
  background: var(--accent);
  color: #ffffff;
}

.rocket-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.rocket-desc {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--ink-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  border-top: 1px solid var(--line);
}

.telemetry-bar {
  width: 6px;
  height: 6px;
  border-radius: 1px;
  background-color: var(--accent);
}

.footer-meta,
.inspect-link {
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: var(--ink-muted);
}

.rocket-card:hover .inspect-link {
  color: var(--ink);
}

.arrow-icon {
  transition: transform 0.2s ease;
}

.rocket-card:hover .arrow-icon {
  transform: translateX(3px);
}
</style>
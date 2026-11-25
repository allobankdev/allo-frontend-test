<!--
  Route: /rockets/:id
  Fungsi: Halaman 2 (Detail Roket). Cek data di store dulu (biar roket custom tetap kebuka),
          kalau nggak ada baru fetch ke API (misalnya pas di-refresh). Nampilin gambar,
          nama, deskripsi, biaya peluncuran, negara, sama first flight dengan fallback aman.
  Dipakai di:
    - Otomatis kebaca oleh vue-router lewat unplugin-vue-router
    - Diakses waktu klik kartu di src/components/RocketCard.vue
-->

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import RocketImage from '@/components/RocketImage.vue'
import StatusView from '@/components/StatusView.vue'
import { fetchRocketById } from '@/services/rocketsApi'
import { useRocketStore } from '@/stores/rocketStore'
import { formatCurrency, formatDate, type Rocket } from '@/types/rocket'

const route = useRoute()
const { findRocketById } = useRocketStore()

const rocketId = String((route.params as Record<string, unknown>).id ?? '')
const rocket = ref<Rocket | null>(null)
const status = ref<'loading' | 'success' | 'error'>('loading')
const error = ref<string | null>(null)
let abortController: AbortController | null = null

async function loadDetail() {
  if (!rocketId) {
    status.value = 'error'
    error.value = 'Invalid rocket ID.'
    return
  }

  const cached = findRocketById(rocketId)
  if (cached) {
    rocket.value = cached
    status.value = 'success'
    return
  }

  if (rocketId.startsWith('local-')) {
    status.value = 'error'
    error.value = 'Custom rocket is only stored in memory and resets on page reload.'
    return
  }

  status.value = 'loading'
  error.value = null
  abortController = new AbortController()

  try {
    rocket.value = await fetchRocketById(rocketId, abortController.signal)
    status.value = 'success'
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return
    error.value =
      err instanceof Error ? err.message : 'Failed to load rocket details.'
    status.value = 'error'
  }
}

onMounted(() => {
  loadDetail()
})

onUnmounted(() => {
  abortController?.abort()
})
</script>

<template>
  <div>
    <nav class="hud-nav">
      <v-container
        max-width="1080"
        class="py-3 d-flex align-center justify-space-between"
      >
        <v-btn
          to="/"
          variant="text"
          density="comfortable"
          prepend-icon="mdi-arrow-left"
          class="px-2 font-mono back-btn"
        >
          RETURN TO FLEET
        </v-btn>
        <span class="font-mono nav-id">TELEMETRY // CFG-{{ rocketId }}</span>
      </v-container>
    </nav>

    <v-container
      max-width="1080"
      class="py-8 py-md-12"
    >
      <StatusView
        v-if="status === 'loading'"
        type="loading"
        variant="detail"
        message="Acquiring vehicle telemetry..."
      />

      <StatusView
        v-else-if="status === 'error'"
        type="error"
        :message="error ?? undefined"
        :show-retry="!rocketId.startsWith('local-')"
        @retry="loadDetail()"
      />

      <v-card
        v-else-if="rocket"
        variant="flat"
        rounded="lg"
        class="detail-shell overflow-hidden"
      >
        <v-row no-gutters>
          <!-- Optical Viewport -->
          <v-col
            cols="12"
            md="5"
            class="image-col"
          >
            <div class="viewport-wrap">
              <RocketImage
                :src="rocket.imageUrl"
                :alt="rocket.name"
                height="440px"
                class="detail-img"
              />
              <span
                class="hud-corner tl"
                aria-hidden="true"
              />
              <span
                class="hud-corner tr"
                aria-hidden="true"
              />
              <span
                class="hud-corner bl"
                aria-hidden="true"
              />
              <span
                class="hud-corner br"
                aria-hidden="true"
              />
            </div>
          </v-col>

          <!-- Avionics Spec Panel -->
          <v-col
            cols="12"
            md="7"
            class="pa-6 pa-md-9 d-flex flex-column justify-space-between"
          >
            <div>
              <div class="d-flex flex-wrap align-center ga-3 mb-3">
                <span class="font-mono eyebrow">VEHICLE SPECIFICATION</span>
                <span
                  v-if="rocket.isLocal"
                  class="pill-amber font-mono"
                >CUSTOM</span>
              </div>

              <h1 class="font-display detail-title mb-4">
                {{ rocket.name }}
              </h1>

              <p class="detail-desc mb-8">
                {{ rocket.description ?? 'No mission brief available for this launch vehicle.' }}
              </p>
            </div>

            <!-- Instrument Readout Tiles -->
            <div class="telemetry-grid">
              <div class="instrument-tile">
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="font-mono spec-label">COST PER LAUNCH</span>
                  <v-icon
                    icon="mdi-currency-usd"
                    size="16"
                    class="tile-icon"
                  />
                </div>
                <div
                  class="font-mono spec-value"
                  :class="{ 'is-missing': rocket.launchCost === null }"
                >
                  {{ formatCurrency(rocket.launchCost) }}
                </div>
              </div>

              <div class="instrument-tile">
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="font-mono spec-label">COUNTRY</span>
                  <v-icon
                    icon="mdi-earth"
                    size="16"
                    class="tile-icon"
                  />
                </div>
                <div
                  class="font-mono spec-value"
                  :class="{ 'is-missing': !rocket.countryCode }"
                >
                  {{ rocket.countryCode ?? 'Unknown' }}
                </div>
              </div>

              <div class="instrument-tile">
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="font-mono spec-label">FIRST FLIGHT</span>
                  <v-icon
                    icon="mdi-calendar-blank-outline"
                    size="16"
                    class="tile-icon"
                  />
                </div>
                <div
                  class="font-mono spec-value"
                  :class="{ 'is-missing': !rocket.firstFlight }"
                >
                  {{ formatDate(rocket.firstFlight) }}
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.hud-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(14, 15, 17, 0.86);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
}

.back-btn,
.nav-id,
.eyebrow,
.spec-label {
  font-size: 0.75rem;
  letter-spacing: 0.06em;
}

.back-btn { color: var(--ink); }
.nav-id,
.spec-label { color: var(--ink-muted); }
.eyebrow { color: var(--accent); }

.detail-shell {
  background-color: var(--hull);
  border: 1px solid var(--line);
}

.image-col {
  border-bottom: 1px solid var(--line);
}

@media (min-width: 960px) {
  .image-col {
    border-bottom: 0;
    border-right: 1px solid var(--line);
  }
}

.viewport-wrap {
  position: relative;
  height: 100%;
  min-height: 320px;
  max-height: 460px;
  overflow: hidden;
}

.detail-img {
  height: 100% !important;
  min-height: 320px;
  max-height: 460px;
}

.hud-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: rgba(255, 255, 255, 0.35);
  border-style: solid;
  pointer-events: none;
}

.hud-corner.tl { top: 12px; left: 12px; border-width: 1.5px 0 0 1.5px; }
.hud-corner.tr { top: 12px; right: 12px; border-width: 1.5px 1.5px 0 0; }
.hud-corner.bl { bottom: 12px; left: 12px; border-width: 0 0 1.5px 1.5px; }
.hud-corner.br { bottom: 12px; right: 12px; border-width: 0 1.5px 1.5px 0; }

.pill-amber {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--accent);
  color: #ffffff;
}

.detail-title {
  font-size: clamp(1.75rem, 3vw, 2.4rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.12;
  color: var(--ink);
}

.detail-desc {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--ink-secondary);
  max-width: 60ch;
}

.telemetry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(165px, 1fr));
  gap: 12px;
}

/* Uniform 1px border — no accent border-top on rounded element */
.instrument-tile {
  padding: 16px;
  border-radius: 8px;
  background-color: var(--void);
  border: 1px solid var(--line);
}

.tile-icon {
  color: var(--ink-muted);
}

.spec-value {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--ink);
}

.spec-value.is-missing {
  color: var(--ink-muted);
  font-weight: 400;
}
</style>
<template>
  <div class="detail-view">

    <!-- ── Loading ── -->
    <LoadingState v-if="store.isDetailLoading" message="Memuat detail roket…" />

    <!-- ── Error ── -->
    <ErrorState
      v-else-if="store.detailError"
      :message="store.detailError"
      @retry="reload"
    />

    <!-- ── Content ── -->
    <template v-else-if="rocket">
      <!-- Back -->
      <div class="detail-back">
        <button class="back-btn" @click="$router.back()">
          <v-icon size="18">mdi-arrow-left</v-icon>
          Kembali
        </button>
        <v-chip
          v-if="rocket.isLocal"
          color="secondary"
          size="small"
          variant="tonal"
          prepend-icon="mdi-plus-circle"
        >
          Roket Lokal
        </v-chip>
      </div>

      <!-- ── Hero ── -->
      <div class="detail-hero glass-card">
        <!-- Image half -->
        <div class="detail-hero__img-wrap">
          <img
            v-if="rocket.image_url && !imgError"
            :src="rocket.image_url"
            :alt="rocket.full_name"
            class="detail-hero__img"
            @error="imgError = true"
          />
          <div v-else class="detail-hero__img-fallback">
            <v-icon size="96" color="primary" style="opacity:0.2">mdi-rocket</v-icon>
          </div>

          <!-- Gradient overlay on image -->
          <div class="detail-hero__img-overlay" />
        </div>

        <!-- Info half -->
        <div class="detail-hero__info">
          <p class="detail-hero__eyebrow">
            <v-icon size="13" color="secondary">mdi-satellite-variant</v-icon>
            SpaceX · {{ rocket.manufacturer?.country_code || '–' }}
          </p>

          <h1 class="detail-hero__title">{{ rocket.full_name || '–' }}</h1>

          <p class="detail-hero__desc">
            {{ rocket.description || 'Tidak ada deskripsi tersedia untuk roket ini.' }}
          </p>

          <!-- Key stats pills -->
          <div class="detail-hero__pills">
            <div class="detail-pill">
              <v-icon size="15" color="warning">mdi-currency-usd</v-icon>
              <span class="detail-pill__label">Biaya Peluncuran</span>
              <span class="detail-pill__value">{{ formatCost(rocket.launch_cost) }}</span>
            </div>
            <div class="detail-pill">
              <v-icon size="15" color="secondary">mdi-calendar-star</v-icon>
              <span class="detail-pill__label">Penerbangan Perdana</span>
              <span class="detail-pill__value">{{ formatDate(rocket.maiden_flight) }}</span>
            </div>
            <div class="detail-pill">
              <v-icon size="15" color="success">mdi-earth</v-icon>
              <span class="detail-pill__label">Negara</span>
              <span class="detail-pill__value">{{ rocket.manufacturer?.country_code || '–' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Stats row ── -->
      <div class="detail-stats">
        <div
          v-for="stat in launchStats"
          :key="stat.label"
          class="detail-stat-card glass-card"
        >
          <v-icon :color="stat.color" size="26" class="mb-2">{{ stat.icon }}</v-icon>
          <div class="detail-stat-card__value">{{ stat.value }}</div>
          <div class="detail-stat-card__label">{{ stat.label }}</div>
        </div>
      </div>

      <!-- ── Specs + Links ── -->
      <div class="detail-bottom">
        <!-- Technical specs -->
        <div class="glass-card detail-specs">
          <h2 class="detail-section-title">Spesifikasi Teknis</h2>
          <div class="spec-list">
            <div v-for="spec in techSpecs" :key="spec.label" class="spec-item">
              <span class="spec-item__label">{{ spec.label }}</span>
              <span class="spec-item__value" :class="{ 'spec-item__value--missing': spec.value === '–' }">
                {{ spec.value }}
              </span>
            </div>
          </div>
        </div>

        <!-- External links -->
        <div class="glass-card detail-links">
          <h2 class="detail-section-title">Tautan Eksternal</h2>
          <div class="link-list">
            <a
              v-if="rocket.wiki_url"
              :href="rocket.wiki_url"
              target="_blank"
              rel="noopener"
              class="ext-link"
            >
              <v-icon size="18" color="primary">mdi-wikipedia</v-icon>
              Wikipedia
              <v-icon size="13" color="medium-emphasis">mdi-open-in-new</v-icon>
            </a>
            <a
              v-if="rocket.info_url"
              :href="rocket.info_url"
              target="_blank"
              rel="noopener"
              class="ext-link"
            >
              <v-icon size="18" color="secondary">mdi-information-outline</v-icon>
              Info Resmi
              <v-icon size="13" color="medium-emphasis">mdi-open-in-new</v-icon>
            </a>
            <p v-if="!rocket.wiki_url && !rocket.info_url" class="text-caption text-medium-emphasis">
              Tidak ada tautan tersedia.
            </p>
          </div>

          <!-- Manufacturer card -->
          <template v-if="rocket.manufacturer">
            <div class="detail-section-title mt-5">Manufaktur</div>
            <div class="mfr-card">
              <div class="mfr-card__name">{{ rocket.manufacturer.name }}</div>
              <div class="mfr-card__meta">
                <span>{{ rocket.manufacturer.country_code }}</span>
                <span v-if="rocket.manufacturer.founding_year">
                  · Berdiri {{ rocket.manufacturer.founding_year }}
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>

    <!-- ── No rocket found (edge case) ── -->
    <EmptyState
      v-else
      title="Roket Tidak Ditemukan"
      subtitle="Data untuk roket ini tidak tersedia."
    >
      <button class="back-btn mt-4" @click="$router.push('/')">
        <v-icon size="16">mdi-arrow-left</v-icon>
        Kembali ke Daftar
      </button>
    </EmptyState>

  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { formatDate, formatCost, formatMass, formatLength, formatThrust, formatSuccessRate } from '@/utils/formatters'

const route = useRoute()
const store = useRocketStore()
const imgError = ref(false)

const rocket = computed(() => store.selectedRocket)

function reload() {
  store.loadRocketById(Number(route.params.id))
}

onMounted(reload)
onUnmounted(() => store.clearDetail())

// ── Stats ──────────────────────────────────────────────────
const launchStats = computed(() => {
  if (!rocket.value) return []
  const r = rocket.value
  return [
    { icon: 'mdi-rocket-launch', label: 'Total Peluncuran', value: r.total_launch_count, color: 'primary' },
    { icon: 'mdi-check-circle-outline', label: 'Berhasil', value: r.successful_launches, color: 'success' },
    { icon: 'mdi-close-circle-outline', label: 'Gagal', value: r.failed_launches, color: 'error' },
    {
      icon: 'mdi-percent-outline',
      label: 'Tingkat Sukses',
      value: formatSuccessRate(r.successful_launches, r.total_launch_count),
      color: 'info',
    },
  ]
})

// ── Specs ──────────────────────────────────────────────────
const techSpecs = computed(() => {
  if (!rocket.value) return []
  const r = rocket.value
  return [
    { label: 'Nama Lengkap', value: r.full_name || '–' },
    { label: 'Keluarga', value: r.family || '–' },
    { label: 'Varian', value: r.variant || '–' },
    { label: 'Panjang', value: formatLength(r.length) },
    { label: 'Diameter', value: formatLength(r.diameter) },
    { label: 'Kapasitas LEO', value: formatMass(r.leo_capacity) },
    { label: 'Kapasitas GTO', value: formatMass(r.gto_capacity) },
    { label: 'Dorongan (TO)', value: formatThrust(r.to_thrust) },
    { label: 'Tahap Min/Max', value: (r.min_stage != null && r.max_stage != null) ? `${r.min_stage} / ${r.max_stage}` : '–' },
    { label: 'Pendarat Berhasil', value: `${r.successful_landings} / ${r.attempted_landings}` },
    { label: 'Peluncuran Pending', value: String(r.pending_launches) },
  ]
})
</script>

<style scoped>
.detail-view {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px 80px;
}

/* ── Back ── */
.detail-back {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(226,232,240,0.75);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s;
}
.back-btn:hover { background: rgba(255,255,255,0.09); color: #E2E8F0; }

/* ── Hero card ── */
.detail-hero {
  border-radius: 20px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 420px 1fr;
  margin-bottom: 24px;
}

.detail-hero__img-wrap {
  position: relative;
  height: 420px;
  background: linear-gradient(135deg, #0f172a, #1e2a3f);
  overflow: hidden;
}

.detail-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-hero__img-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-hero__img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 60%, rgba(17,24,39,0.9) 100%);
}

.detail-hero__info {
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.detail-hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(34,211,238,0.75);
  margin-bottom: 10px;
}

.detail-hero__title {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 800;
  color: #E2E8F0;
  line-height: 1.2;
  margin: 0 0 16px;
}

.detail-hero__desc {
  font-size: 0.9rem;
  color: rgba(226,232,240,0.55);
  line-height: 1.7;
  margin-bottom: 28px;
}

/* ── Pills ── */
.detail-hero__pills {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px;
  padding: 10px 14px;
}

.detail-pill__label {
  font-size: 0.75rem;
  color: rgba(226,232,240,0.45);
  font-weight: 500;
  flex: 1;
}

.detail-pill__value {
  font-size: 0.85rem;
  font-weight: 700;
  color: #E2E8F0;
}

/* ── Stats row ── */
.detail-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.detail-stat-card {
  border-radius: 14px;
  padding: 20px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail-stat-card__value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #E2E8F0;
  line-height: 1.2;
}

.detail-stat-card__label {
  font-size: 0.72rem;
  color: rgba(226,232,240,0.45);
  margin-top: 4px;
  font-weight: 500;
}

/* ── Bottom row ── */
.detail-bottom {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
}

.detail-specs, .detail-links {
  border-radius: 16px;
  padding: 24px;
}

.detail-section-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(226,232,240,0.45);
  margin-bottom: 16px;
}

/* ── Spec list ── */
.spec-list { display: flex; flex-direction: column; gap: 1px; }

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.spec-item:last-child { border-bottom: none; }

.spec-item__label {
  font-size: 0.82rem;
  color: rgba(226,232,240,0.5);
}

.spec-item__value {
  font-size: 0.85rem;
  font-weight: 600;
  color: #E2E8F0;
}

.spec-item__value--missing { color: rgba(226,232,240,0.25); font-weight: 400; }

/* ── Links ── */
.link-list { display: flex; flex-direction: column; gap: 8px; }

.ext-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  color: rgba(226,232,240,0.75);
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.18s;
}
.ext-link:hover {
  background: rgba(79,142,247,0.1);
  border-color: rgba(79,142,247,0.3);
  color: #E2E8F0;
}
.ext-link .v-icon:last-child { margin-left: auto; }

/* ── Manufacturer ── */
.mfr-card {
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
}
.mfr-card__name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #E2E8F0;
}
.mfr-card__meta {
  font-size: 0.75rem;
  color: rgba(226,232,240,0.45);
  margin-top: 3px;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .detail-hero { grid-template-columns: 1fr; }
  .detail-hero__img-wrap { height: 260px; }
  .detail-hero__img-overlay { background: linear-gradient(0deg, rgba(17,24,39,0.9) 0%, transparent 60%); }
  .detail-stats { grid-template-columns: repeat(2, 1fr); }
  .detail-bottom { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .detail-view { padding: 20px 16px 60px; }
  .detail-hero__info { padding: 24px 20px; }
  .detail-stats { grid-template-columns: repeat(2, 1fr); }
}
</style>

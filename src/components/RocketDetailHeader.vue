<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-4">
      <div>
        <h1 class="detail-title">
          {{ rocketName }}
        </h1>
        <p class="detail-subtitle">
          {{ manufacturerName }} &bull; {{ country }}
        </p>
      </div>

      <div class="d-flex flex-wrap ga-2">
        <span class="spec-tag">
          <v-icon
            icon="mdi-map-marker"
            size="14"
            class="mr-1"
          />
          {{ country }}
        </span>
        <span
          v-if="maidenFlight"
          class="spec-tag spec-tag--date"
        >
          <v-icon
            icon="mdi-calendar-blank"
            size="14"
            class="mr-1"
          />
          {{ maidenFlight }}
        </span>
        <span
          v-if="launchCost"
          class="spec-tag spec-tag--cost"
        >
          <v-icon
            icon="mdi-currency-usd"
            size="14"
            class="mr-1"
          />
          {{ launchCost }} / launch
        </span>
      </div>
    </div>

    <v-divider class="my-6" />

    <section class="overview-section mb-8">
      <h2 class="section-heading mb-3">
        Vehicle Overview
      </h2>
      <p class="detail-desc">
        {{ description }}
      </p>
    </section>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  rocketName: string
  manufacturerName: string
  country: string
  maidenFlight: string | null
  launchCost: string | null
  description: string
}>()
</script>

<style scoped>
.detail-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.detail-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
}

.spec-tag {
  display: inline-flex;
  align-items: center;
  background: #f1f5f9;
  color: #334155;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
}

.spec-tag--date {
  background: #ecfdf5;
  color: #047857;
}

.spec-tag--cost {
  background: #eff6ff;
  color: #1d4ed8;
}

.section-heading {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.detail-desc {
  font-size: 1rem;
  line-height: 1.7;
  color: #475569;
}

@media (max-width: 600px) {
  .detail-title {
    font-size: 1.6rem;
  }
}
</style>

<template>
  <main class="detail-shell">
    <header class="detail-topbar">
      <RouterLink
        class="brand"
        to="/"
      >
        <span class="brand-mark"><v-icon icon="mdi-rocket-launch" /></span>
        <span>ORBITAL<span class="brand-light"> / ARCHIVE</span></span>
      </RouterLink>
      <RouterLink
        class="back-link"
        to="/"
      >
        <v-icon
          icon="mdi-arrow-left"
          size="17"
        /> BACK TO FLEET
      </RouterLink>
    </header>

    <section
      v-if="status === 'loading'"
      class="detail-state"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="38"
        width="3"
      />
      <p>Retrieving vehicle specifications...</p>
    </section>
    <section
      v-else-if="status === 'error'"
      class="detail-state"
    >
      <v-icon
        class="error-icon"
        icon="mdi-satellite-uplink"
      />
      <h1>Vehicle unavailable</h1>
      <p>{{ errorMessage }}</p>
      <div class="error-actions">
        <v-btn
          color="primary"
          prepend-icon="mdi-refresh"
          variant="flat"
          @click="loadRocket"
        >
          Try again
        </v-btn>
        <v-btn
          to="/"
          variant="text"
        >
          Back to fleet
        </v-btn>
      </div>
    </section>
    <template v-else-if="rocket">
      <div class="breadcrumb">
        <RouterLink to="/">
          FLEET
        </RouterLink><v-icon
          icon="mdi-chevron-right"
          size="15"
        /> VEHICLE PROFILE
      </div>
      <section class="detail-hero">
        <div class="detail-copy">
          <p class="eyebrow">
            VEHICLE PROFILE <span>· {{ rocket.isLocal ? 'LOCAL ENTRY' : `ID ${rocket.id}` }}</span>
          </p>
          <h1>{{ rocket.name }}</h1>
          <p class="description">
            {{ rocket.description || 'No description is available for this vehicle yet.' }}
          </p>
          <div class="detail-cta">
            <v-icon icon="mdi-earth" />
            <span>{{ rocket.country || 'COUNTRY NOT AVAILABLE' }}</span>
          </div>
        </div>
        <div class="detail-image">
          <img
            v-if="rocket.imageUrl"
            :src="rocket.imageUrl"
            :alt="rocket.name"
          >
          <div
            v-else
            class="image-fallback"
          >
            <v-icon icon="mdi-rocket-launch-outline" /><span>IMAGE NOT AVAILABLE</span>
          </div>
          <span class="image-caption">SPACEX / LAUNCH SYSTEMS</span>
        </div>
      </section>

      <section class="spec-section">
        <div class="spec-heading">
          <div>
            <p class="eyebrow">
              FLIGHT DATA
            </p><h2>Specifications</h2>
          </div>
          <span class="spec-caption">KEY VEHICLE DETAILS</span>
        </div>
        <div class="spec-grid">
          <article class="spec-card">
            <v-icon icon="mdi-cash-multiple" />
            <span class="spec-label">COST PER LAUNCH</span>
            <strong>{{ formattedCost }}</strong>
          </article>
          <article class="spec-card">
            <v-icon icon="mdi-map-marker-outline" />
            <span class="spec-label">COUNTRY</span>
            <strong>{{ rocket.country || 'Not available' }}</strong>
          </article>
          <article class="spec-card">
            <v-icon icon="mdi-calendar-outline" />
            <span class="spec-label">FIRST FLIGHT</span>
            <strong>{{ formattedFlight }}</strong>
          </article>
        </div>
      </section>
    </template>

    <footer class="detail-footer">
      <span>ORBITAL / ARCHIVE</span><span>DATA FROM LAUNCH LIBRARY 2</span>
    </footer>
  </main>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useRocketsStore, type Rocket } from '@/stores/rockets'

  const route = useRoute()
  const { fetchRocket } = useRocketsStore()
  const rocket = ref<Rocket | null>(null)
  const status = ref<'loading' | 'success' | 'error'>('loading')
  const errorMessage = ref('')
  const rocketId = computed(() => String(route.params.id ?? ''))

  const formattedCost = computed(() => {
    if (!rocket.value?.launchCost) return 'Not available'
    const amount = Number(rocket.value.launchCost.replace(/[$,]/g, ''))
    return Number.isFinite(amount)
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
      : rocket.value.launchCost
  })
  const formattedFlight = computed(() => {
    if (!rocket.value?.maidenFlight) return 'Not available'
    const date = new Date(rocket.value.maidenFlight)
    return Number.isNaN(date.getTime())
      ? rocket.value.maidenFlight
      : new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date)
  })

  async function loadRocket () {
    status.value = 'loading'
    errorMessage.value = ''

    try {
      rocket.value = await fetchRocket(rocketId.value)
      status.value = 'success'
    } catch (error) {
      status.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : 'An unexpected error occurred.'
    }
  }

  watch(rocketId, loadRocket, { immediate: true })
</script>

<style scoped>
  .detail-shell { --ink: #f1f1ed; --muted: #969b9e; --accent: #c5ff6b; width: min(1080px, calc(100% - 64px)); min-height: 100vh; margin: 0 auto; color: var(--ink); }
  .detail-topbar { height: 82px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #ffffff19; }
  .brand { display: inline-flex; align-items: center; gap: 11px; color: var(--ink); font-size: 12px; font-weight: 800; letter-spacing: .13em; text-decoration: none; }
  .brand-mark { width: 34px; height: 34px; display: grid; place-items: center; color: #11150e; background: var(--accent); border-radius: 50%; }
  .brand-light { color: var(--muted); font-weight: 500; }
  .back-link { display: flex; align-items: center; gap: 8px; color: #aeb4b0; font-size: 10px; font-weight: 600; letter-spacing: .12em; text-decoration: none; }
  .back-link:hover { color: var(--accent); }
  .breadcrumb { display: flex; align-items: center; gap: 8px; margin: 27px 0 10px; color: #838b86; font-family: monospace; font-size: 9px; letter-spacing: .13em; }
  .breadcrumb a { color: var(--accent); text-decoration: none; }
  .detail-hero { min-height: 390px; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 36px; }
  .detail-copy { padding: 35px 0; }
  .eyebrow { color: var(--accent); font-size: 10px; font-weight: 700; letter-spacing: .2em; }
  .eyebrow span { color: #858d87; }
  h1 { margin: 20px 0 19px; font-size: clamp(38px, 6vw, 68px); line-height: 1.03; letter-spacing: -.06em; font-weight: 500; }
  .description { max-width: 480px; color: #a9adae; font-size: 13px; line-height: 1.85; }
  .detail-cta { display: inline-flex; align-items: center; gap: 9px; margin-top: 18px; color: var(--accent); font-size: 10px; letter-spacing: .12em; }
  .detail-image { height: 320px; position: relative; overflow: hidden; border: 1px solid #ffffff14; border-radius: 7px; background: radial-gradient(ellipse at 50% 100%, #baff5425, transparent 65%), #151918; }
  .detail-image img { width: 100%; height: 100%; object-fit: cover; }
  .image-fallback { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #929b94; font-family: monospace; font-size: 9px; letter-spacing: .12em; }
  .image-fallback .v-icon { color: var(--accent); font-size: 52px; }
  .image-caption { position: absolute; right: 13px; bottom: 12px; padding: 6px 8px; color: #e0e5df; background: #111513c7; font-family: monospace; font-size: 8px; letter-spacing: .11em; }
  .spec-section { padding: 32px 0 72px; border-top: 1px solid #ffffff19; }
  .spec-heading { display: flex; align-items: end; justify-content: space-between; margin-bottom: 22px; }
  .spec-heading .eyebrow { margin: 0 0 8px; }
  h2 { margin: 0; font-size: 27px; font-weight: 500; letter-spacing: -.04em; }
  .spec-caption { color: #828b85; font-family: monospace; font-size: 9px; letter-spacing: .12em; }
  .spec-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .spec-card { min-height: 145px; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding: 20px; background: #151918; border: 1px solid #ffffff12; border-radius: 7px; }
  .spec-card > .v-icon { color: var(--accent); font-size: 19px; }
  .spec-label { color: #858d87; font-family: monospace; font-size: 9px; letter-spacing: .1em; }
  .spec-card strong { color: #e8ebe7; font-size: 17px; font-weight: 500; }
  .detail-state { min-height: 65vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: var(--muted); text-align: center; }
  .detail-state h1 { margin: 0; color: var(--ink); font-size: 32px; }
  .detail-state p { max-width: 460px; font-size: 13px; line-height: 1.6; }
  .error-icon { color: var(--accent); font-size: 36px; }
  .error-actions { display: flex; gap: 8px; }
  .detail-footer { min-height: 66px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #ffffff19; color: var(--muted); font-size: 9px; font-weight: 600; letter-spacing: .12em; }
  @media (max-width: 700px) {
    .detail-shell { width: calc(100% - 40px); }
    .detail-hero { grid-template-columns: 1fr; gap: 4px; padding: 16px 0 34px; }
    .detail-copy { padding: 20px 0 7px; }
    .detail-image { height: min(66vw, 340px); }
    .spec-grid { grid-template-columns: 1fr; }
    .spec-card { min-height: 116px; }
  }
  @media (max-width: 480px) {
    .detail-shell { width: calc(100% - 36px); }
    .detail-topbar { height: 68px; }
    .back-link { font-size: 8px; }
    .spec-heading { align-items: start; gap: 10px; }
    .spec-caption { padding-top: 4px; font-size: 7px; }
  }
</style>

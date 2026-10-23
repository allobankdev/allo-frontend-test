<template>
  <main class="page-shell">
    <header class="topbar">
      <RouterLink
        class="brand"
        to="/"
      >
        <span class="brand-mark"><v-icon icon="mdi-rocket-launch" /></span>
        <span>ORBITAL<span class="brand-light"> / ARCHIVE</span></span>
      </RouterLink>
      <span class="topbar-note"><span class="live-dot" /> SPACE X · LAUNCHER DATABASE</span>
    </header>

    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">
          A CATALOGUE OF FLIGHT
        </p>
        <h1>Built to reach<br><span>beyond.</span></h1>
        <p class="hero-description">
          Explore the launch vehicles engineered to take humanity further.
          Specs, origins, and stories from the SpaceX fleet.
        </p>
        <div class="hero-meta">
          <span><v-icon
            icon="mdi-database-outline"
            size="16"
          /> {{ rockets.length }} VEHICLES</span>
          <span class="meta-divider" />
          <span><v-icon
            icon="mdi-earth"
            size="16"
          /> ONE FRONTIER</span>
        </div>
      </div>
      <div
        class="hero-art"
        aria-hidden="true"
      >
        <div class="orbit orbit-one" />
        <div class="orbit orbit-two" />
        <div class="hero-glow" />
        <v-icon
          class="hero-rocket"
          icon="mdi-rocket"
        />
        <span class="art-coordinate">29° 33' N<br>90° 35' W</span>
        <span class="art-label">STARSHIP<br>FLIGHT SYSTEM</span>
      </div>
    </section>

    <section class="fleet-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">
            THE FLEET
          </p>
          <h2>Launch vehicles <span class="count-label">({{ filteredRockets.length }})</span></h2>
        </div>
        <v-btn
          class="add-button"
          prepend-icon="mdi-plus"
          variant="outlined"
          @click="addDialogOpen = true"
        >
          Add a rocket
        </v-btn>
      </div>

      <div class="toolbar">
        <v-text-field
          v-model="search"
          aria-label="Search rockets"
          class="search-field"
          clearable
          density="comfortable"
          hide-details
          placeholder="Search the fleet..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
        <span class="sort-label"><v-icon
          icon="mdi-sort"
          size="18"
        /> NAME A—Z</span>
      </div>

      <div
        v-if="status === 'loading'"
        class="state-panel"
      >
        <v-progress-circular
          color="primary"
          indeterminate
          size="38"
          width="3"
        />
        <p>Loading the fleet...</p>
      </div>

      <div
        v-else-if="status === 'error'"
        class="state-panel error-panel"
      >
        <v-icon
          class="state-icon"
          icon="mdi-satellite-uplink"
        />
        <h3>We lost the signal.</h3>
        <p>{{ errorMessage }}</p>
        <v-btn
          color="primary"
          prepend-icon="mdi-refresh"
          variant="flat"
          @click="loadRockets(true)"
        >
          Try again
        </v-btn>
      </div>

      <div
        v-else-if="filteredRockets.length"
        class="rocket-grid"
      >
        <RocketCard
          v-for="(rocket, index) in filteredRockets"
          :key="rocket.id"
          :rocket="rocket"
          :style="{ '--card-index': index }"
        />
      </div>

      <div
        v-else
        class="state-panel empty-panel"
      >
        <v-icon
          class="state-icon"
          icon="mdi-magnify-close"
        />
        <h3>No rockets found.</h3>
        <p>Try another search term to explore the fleet.</p>
        <v-btn
          variant="text"
          @click="search = ''"
        >
          Clear search
        </v-btn>
      </div>
    </section>

    <footer class="footer">
      <span>ORBITAL / ARCHIVE</span>
      <span>DATA FROM LAUNCH LIBRARY 2</span>
      <span>MADE FOR THE CURIOUS <v-icon
        icon="mdi-arrow-up-right"
        size="14"
      /></span>
    </footer>

    <AddRocketDialog
      v-model="addDialogOpen"
      @save="addRocketFromDialog"
    />
  </main>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import AddRocketDialog from '@/components/AddRocketDialog.vue'
  import RocketCard from '@/components/RocketCard.vue'
  import { useRocketsStore, type NewRocket } from '@/stores/rockets'

  const { rockets, status, errorMessage, loadRockets, addRocket } = useRocketsStore()
  const search = ref('')
  const addDialogOpen = ref(false)

  const filteredRockets = computed(() => {
    const query = search.value.trim().toLowerCase()

    return [...rockets.value]
      .filter(rocket => !query || `${rocket.name} ${rocket.description ?? ''}`.toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name))
  })

  function addRocketFromDialog (rocket: NewRocket) {
    addRocket(rocket)
    addDialogOpen.value = false
  }

  onMounted(() => loadRockets())
</script>

<style scoped>
  .page-shell {
    --ink: #f1f1ed;
    --muted: #969b9e;
    --accent: #c5ff6b;
    width: min(1180px, calc(100% - 64px));
    margin: 0 auto;
    color: var(--ink);
  }

  .topbar {
    height: 82px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, .1);
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 11px;
    color: var(--ink);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: .13em;
    text-decoration: none;
  }

  .brand-mark {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    color: #11150e;
    background: var(--accent);
    border-radius: 50%;
  }

  .brand-light { color: var(--muted); font-weight: 500; }
  .topbar-note, .hero-meta, .sort-label, .footer {
    color: var(--muted);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .12em;
  }
  .topbar-note { display: flex; align-items: center; gap: 9px; }
  .live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 12px #c5ff6b80; }

  .hero {
    min-height: 400px;
    display: grid;
    grid-template-columns: 1fr .9fr;
    align-items: center;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid rgba(255, 255, 255, .1);
  }

  .hero-copy { position: relative; z-index: 1; padding: 52px 0 60px; }
  .eyebrow { color: var(--accent); font-size: 10px; font-weight: 700; letter-spacing: .2em; }
  h1 { margin: 19px 0 17px; font-size: clamp(48px, 7vw, 82px); line-height: .98; letter-spacing: -.065em; font-weight: 500; }
  h1 span { color: var(--accent); }
  .hero-description { max-width: 430px; color: #a9adae; font-size: 14px; line-height: 1.8; }
  .hero-meta { display: flex; align-items: center; gap: 18px; margin-top: 34px; }
  .hero-meta span { display: inline-flex; align-items: center; gap: 7px; }
  .hero-meta .v-icon { color: var(--accent); }
  .meta-divider { width: 1px; height: 15px; background: #464a48; }

  .hero-art { position: absolute; inset: 0 0 0 47%; overflow: hidden; }
  .hero-glow { position: absolute; width: 300px; height: 300px; left: 50%; top: 49%; transform: translate(-50%, -50%); background: radial-gradient(circle, #baff5430 0%, #789f2410 34%, transparent 70%); }
  .orbit { position: absolute; left: 50%; top: 50%; border: 1px solid #ffffff15; border-radius: 50%; transform: translate(-50%, -50%) rotate(-28deg); }
  .orbit-one { width: 340px; height: 142px; }
  .orbit-two { width: 460px; height: 194px; }
  .hero-rocket { position: absolute; left: 50%; top: 48%; transform: translate(-50%, -50%) rotate(42deg); color: #d5d9d4; font-size: 186px; filter: drop-shadow(0 0 25px #c5ff6b25); }
  .art-coordinate, .art-label { position: absolute; color: #737a77; font-family: monospace; font-size: 9px; letter-spacing: .12em; line-height: 1.7; }
  .art-coordinate { top: 23%; right: 3%; }
  .art-label { left: 8%; bottom: 17%; }

  .fleet-section { padding: 53px 0 75px; }
  .section-heading { display: flex; justify-content: space-between; align-items: end; }
  .section-heading .eyebrow { margin: 0 0 9px; }
  h2 { margin: 0; font-size: 29px; letter-spacing: -.04em; font-weight: 500; }
  .count-label { color: #7e8582; font-size: 17px; }
  .add-button { color: var(--accent); border-color: #c5ff6b6b; text-transform: none; letter-spacing: 0; }
  .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin: 28px 0 22px; }
  .search-field { max-width: 390px; }
  :deep(.search-field .v-field) { border-radius: 8px; }
  :deep(.search-field .v-field__input) { min-height: 46px; font-size: 13px; }
  :deep(.search-field .v-field__outline) { --v-field-border-opacity: .2; }
  .sort-label { display: flex; align-items: center; gap: 8px; }

  .rocket-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 17px; }
  .state-panel { min-height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 13px; color: var(--muted); text-align: center; }
  .state-panel p { max-width: 420px; margin: 0; font-size: 13px; line-height: 1.6; }
  .state-panel h3 { margin: 0; color: var(--ink); font-size: 20px; font-weight: 500; }
  .state-icon { color: var(--accent); font-size: 34px; }
  .error-panel :deep(.v-btn) { margin-top: 5px; }

  .footer { min-height: 66px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, .1); font-size: 9px; }
  .footer span:last-child { display: flex; align-items: center; gap: 3px; color: var(--accent); }

  @media (max-width: 800px) {
    .page-shell { width: min(100% - 40px, 620px); }
    .hero { min-height: 380px; grid-template-columns: 1fr; }
    .hero-copy { padding: 54px 0; }
    .hero-art { left: 38%; opacity: .48; }
    .hero-rocket { font-size: 150px; }
    .rocket-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 540px) {
    .page-shell { width: calc(100% - 36px); }
    .topbar { height: 68px; }
    .topbar-note { font-size: 8px; letter-spacing: .07em; }
    .hero { min-height: 355px; }
    .hero-art { left: 25%; opacity: .33; }
    h1 { font-size: 60px; }
    .hero-description { max-width: 330px; font-size: 13px; }
    .section-heading { align-items: start; gap: 14px; }
    h2 { font-size: 24px; }
    .add-button { min-width: 40px !important; padding: 0 10px !important; font-size: 11px; }
    .toolbar { margin: 22px 0 17px; }
    .sort-label { font-size: 8px; }
    .rocket-grid { grid-template-columns: 1fr; gap: 13px; }
    .footer { gap: 12px; font-size: 7px; letter-spacing: .06em; }
  }
</style>

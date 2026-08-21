<template>
  <div class="list-view">
    <!-- ── Hero header ── -->
    <div class="list-hero">
      <div class="list-hero__content">
        <p class="list-hero__eyebrow">
          <v-icon size="14" color="secondary">mdi-satellite-variant</v-icon>
          Space Exploration
        </p>
        <h1 class="list-hero__title">
          SpaceX <span class="gradient-text">Rockets</span>
        </h1>
        <p class="list-hero__subtitle">
          Jelajahi seluruh armada roket SpaceX lengkap dengan spesifikasi teknis, sejarah peluncuran, dan detail lainnya.
        </p>
      </div>
      <AddRocketForm />
    </div>

    <!-- ── Filter ── -->
    <div class="list-section">
      <RocketFilter />
    </div>

    <!-- ── Count info ── -->
    <div v-if="!store.isLoading && !store.error" class="list-count">
      <span>
        Menampilkan
        <strong class="text-primary">{{ store.filteredRockets.length }}</strong>
        dari
        <strong>{{ store.allRockets.length }}</strong>
        roket
      </span>
    </div>

    <!-- ── Loading ── -->
    <LoadingState v-if="store.isLoading" />

    <!-- ── Error ── -->
    <ErrorState
      v-else-if="store.error"
      :message="store.error"
      @retry="store.retryLoadRockets()"
    />

    <!-- ── Empty (after filter) ── -->
    <EmptyState
      v-else-if="store.filteredRockets.length === 0 && store.hasData"
      title="Tidak Ada Hasil"
      subtitle="Tidak ada roket yang cocok dengan filter. Coba ubah kata kunci atau negara."
    >
      <button class="mt-4 filter-reset-btn" @click="store.resetFilters()">
        <v-icon size="15">mdi-refresh</v-icon> Reset Filter
      </button>
    </EmptyState>

    <!-- ── Grid ── -->
    <div v-else class="list-grid">
      <div
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        class="list-grid__item"
      >
        <RocketCard :rocket="rocket" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import RocketCard from '@/components/rocket/RocketCard.vue'
import RocketFilter from '@/components/rocket/RocketFilter.vue'
import AddRocketForm from '@/components/rocket/AddRocketForm.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const store = useRocketStore()

onMounted(() => {
  store.loadRockets()
})
</script>

<style scoped>
.list-view {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

/* ── Hero ── */
.list-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.list-hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(34, 211, 238, 0.8);
  margin-bottom: 8px;
}

.list-hero__title {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.15;
  color: #E2E8F0;
  margin: 0 0 10px;
}

.list-hero__subtitle {
  font-size: 0.9rem;
  color: rgba(226, 232, 240, 0.5);
  max-width: 460px;
  line-height: 1.6;
  margin: 0;
}

/* ── Filter section ── */
.list-section { margin-bottom: 20px; }

/* ── Count ── */
.list-count {
  font-size: 0.8rem;
  color: rgba(226,232,240,0.45);
  margin-bottom: 20px;
}

/* ── Grid ── */
.list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.list-grid__item {
  animation: card-in 0.35s ease both;
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Stagger items */
.list-grid__item:nth-child(1)  { animation-delay: 0.04s; }
.list-grid__item:nth-child(2)  { animation-delay: 0.07s; }
.list-grid__item:nth-child(3)  { animation-delay: 0.10s; }
.list-grid__item:nth-child(4)  { animation-delay: 0.13s; }
.list-grid__item:nth-child(5)  { animation-delay: 0.16s; }
.list-grid__item:nth-child(6)  { animation-delay: 0.19s; }
.list-grid__item:nth-child(7)  { animation-delay: 0.22s; }
.list-grid__item:nth-child(8)  { animation-delay: 0.25s; }
.list-grid__item:nth-child(n+9) { animation-delay: 0.28s; }

/* ── Reset filter btn ── */
.filter-reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  background: rgba(79, 142, 247, 0.1);
  border: 1px solid rgba(79, 142, 247, 0.3);
  color: #4F8EF7;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
}
.filter-reset-btn:hover { background: rgba(79, 142, 247, 0.2); }

@media (max-width: 600px) {
  .list-view { padding: 24px 16px 60px; }
  .list-hero { flex-direction: column; }
  .list-grid { grid-template-columns: 1fr; }
}

@media (min-width: 601px) and (max-width: 960px) {
  .list-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>

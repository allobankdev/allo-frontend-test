<template>
  <div
    v-if="store.filteredRockets.length > 0"
    class="cad-frame pa-3 mt-8 d-flex flex-column flex-md-row align-center justify-space-between ga-3 rounded-sm"
  >
    <!-- Left: Telemetry Item Counter -->
    <div class="d-flex align-center ga-2">
      <span
        class="font-mono text-caption text-secondary"
        style="font-size: 0.76rem;"
      >
        MANIFEST:
      </span>
      <span
        class="font-mono text-caption text-high-emphasis font-weight-bold"
        style="font-size: 0.76rem;"
      >
        Showing {{ store.paginationMeta.from }}–{{ store.paginationMeta.to }} of {{ store.paginationMeta.total }} Vehicles
      </span>
    </div>

    <!-- Center/Right: Page Navigation Controls -->
    <div class="d-flex align-center flex-wrap ga-2">
      <!-- Items per page selector -->
      <div class="d-none d-sm-flex align-center ga-1 me-3">
        <span
          class="font-mono text-caption text-dim"
          style="font-size: 0.7rem;"
        >PER PAGE:</span>
        <button
          v-for="size in [6, 9, 12]"
          :key="size"
          type="button"
          :class="['page-size-btn font-mono', store.itemsPerPage === size ? 'page-size-active' : '']"
          @click="changePageSize(size)"
        >
          {{ size }}
        </button>
      </div>

      <!-- Previous Page Button -->
      <v-btn
        variant="tonal"
        size="small"
        rounded="sm"
        :disabled="store.currentPage === 1"
        prepend-icon="mdi-chevron-left"
        class="text-none font-mono"
        style="color: #cbd5e1;"
        @click="goToPage(store.currentPage - 1)"
      >
        Prev
      </v-btn>

      <!-- Numbered Page Pills -->
      <div class="d-flex align-center ga-1">
        <button
          v-for="page in store.totalPages"
          :key="page"
          type="button"
          :class="['page-number-btn font-mono', store.currentPage === page ? 'page-number-active' : '']"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Page Button -->
      <v-btn
        variant="tonal"
        size="small"
        rounded="sm"
        :disabled="store.currentPage >= store.totalPages"
        append-icon="mdi-chevron-right"
        class="text-none font-mono"
        style="color: #cbd5e1;"
        @click="goToPage(store.currentPage + 1)"
      >
        Next
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRocketStore } from '@/stores/rocketStore'

const store = useRocketStore()

function goToPage(page: number) {
  store.setPage(page)
  // Smoothly scroll back to top of fleet manifest
  window.scrollTo({ top: 120, behavior: 'smooth' })
}

function changePageSize(size: number) {
  store.setItemsPerPage(size)
}
</script>

<style scoped>
.page-size-btn {
  background: transparent;
  border: 1px solid var(--titanium-border);
  color: var(--text-dim);
  font-size: 0.72rem;
  padding: 2px 7px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-size-btn:hover {
  border-color: rgba(56, 189, 248, 0.4);
  color: var(--text-high);
}

.page-size-active {
  background: rgba(56, 189, 248, 0.15);
  border-color: #38bdf8;
  color: #38bdf8;
  font-weight: 700;
}

.page-number-btn {
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  background: #0b111e;
  border: 1px solid var(--titanium-border);
  color: var(--text-mid);
  font-size: 0.78rem;
  border-radius: 2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.page-number-btn:hover {
  border-color: rgba(56, 189, 248, 0.4);
  color: #f8fafc;
}

.page-number-active {
  background: rgba(56, 189, 248, 0.2);
  border-color: #38bdf8;
  color: #38bdf8;
  font-weight: 700;
}

.text-dim {
  color: var(--text-dim);
}
</style>


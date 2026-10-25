<template>
  <div class="filter-bar glass-card" style="border-radius: 14px">
    <div class="filter-bar__inner">
      <!-- Search -->
      <div class="filter-bar__search">
        <div class="filter-input-wrap">
          <v-icon class="filter-icon" color="primary" size="18">mdi-magnify</v-icon>
          <input
            v-model="localSearch"
            type="text"
            placeholder="Cari nama atau deskripsi roket…"
            class="filter-input"
            @input="onSearchInput"
          />
          <button v-if="localSearch" class="filter-clear" @click="clearSearch">
            <v-icon size="16" color="medium-emphasis">mdi-close-circle</v-icon>
          </button>
        </div>
      </div>

      <!-- Divider (desktop only) -->
      <div class="filter-divider" />

      <!-- Country chips -->
      <div class="filter-bar__countries">
        <span class="filter-label">Negara:</span>
        <div class="filter-chips">
          <button
            class="filter-chip"
            :class="{ 'filter-chip--active': store.filters.country === '' }"
            @click="setCountry('')"
          >
            Semua
          </button>
          <button
            v-for="code in store.availableCountries"
            :key="code"
            class="filter-chip"
            :class="{ 'filter-chip--active': store.filters.country === code }"
            @click="setCountry(code)"
          >
            {{ code }}
          </button>
        </div>
      </div>

      <!-- Reset -->
      <button v-if="hasActiveFilter" class="filter-reset" @click="onReset">
        <v-icon size="15">mdi-refresh</v-icon>
        Reset
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'

const store = useRocketStore()

const localSearch = ref(store.filters.search)

let debounceTimer: ReturnType<typeof setTimeout>

const hasActiveFilter = computed(() =>
  store.filters.search !== '' || store.filters.country !== '',
)

function onSearchInput() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    store.setFilters({ search: localSearch.value.trim() })
  }, 350)
}

function clearSearch() {
  localSearch.value = ''
  store.setFilters({ search: '' })
}

function setCountry(code: string) {
  store.setFilters({ country: code })
}

function onReset() {
  localSearch.value = ''
  store.resetFilters()
}
</script>

<style scoped>
.filter-bar {
  padding: 14px 20px;
}

.filter-bar__inner {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* ── Search input ── */
.filter-bar__search {
  flex: 0 0 auto;
  min-width: 260px;
}

.filter-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 0 12px;
  height: 42px;
  transition: border-color 0.2s;
}

.filter-input-wrap:focus-within {
  border-color: rgba(79, 142, 247, 0.6);
  background: rgba(79, 142, 247, 0.04);
}

.filter-icon { flex-shrink: 0; }

.filter-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #E2E8F0;
  font-size: 0.875rem;
  min-width: 0;
}

.filter-input::placeholder { color: rgba(226,232,240,0.35); }

.filter-clear {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* ── Divider ── */
.filter-divider {
  width: 1px;
  height: 30px;
  background: rgba(255,255,255,0.08);
  flex-shrink: 0;
}

/* ── Country chips ── */
.filter-bar__countries {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
}

.filter-label {
  font-size: 0.75rem;
  color: rgba(226,232,240,0.45);
  white-space: nowrap;
  font-weight: 500;
}

.filter-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-chip {
  height: 28px;
  padding: 0 12px;
  border-radius: 14px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  color: rgba(226,232,240,0.65);
  transition: all 0.18s ease;
}

.filter-chip:hover {
  border-color: rgba(79, 142, 247, 0.5);
  color: #E2E8F0;
}

.filter-chip--active {
  background: rgba(79, 142, 247, 0.18);
  border-color: rgba(79, 142, 247, 0.6);
  color: #4F8EF7;
}

/* ── Reset ── */
.filter-reset {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 12px;
  border-radius: 14px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.06);
  color: rgba(239, 68, 68, 0.8);
  transition: all 0.18s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.filter-reset:hover {
  background: rgba(239, 68, 68, 0.12);
  color: #EF4444;
}

@media (max-width: 600px) {
  .filter-divider { display: none; }
  .filter-bar__search { min-width: 100%; }
  .filter-bar__countries { width: 100%; }
}
</style>

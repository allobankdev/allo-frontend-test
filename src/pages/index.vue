<template>
  <div class="fleet-page">
    <AppNavbar>
      <template #center>
        <RocketFilter v-model="filterQuery" />
      </template>
      <template #actions>
        <AddRocketDialog />
      </template>
    </AppNavbar>

    <main class="main-content">
      <v-container
        class="content-container py-10"
        style="max-width: 1240px;"
      >
        <header class="fleet-header mb-8">
          <div class="fleet-header__text">
            <h1 class="fleet-title">
              SpaceX Fleet Overview
            </h1>
            <p class="fleet-subtitle">
              Comprehensive registry of SpaceX orbital launch vehicle configurations. Explore mission history, maiden flights, and launch capabilities.
            </p>
          </div>

          <div class="fleet-controls">
            <v-menu location="bottom end">
              <template #activator="{ props: menuProps }">
                <v-btn
                  v-bind="menuProps"
                  variant="outlined"
                  class="control-btn"
                  prepend-icon="mdi-filter-variant"
                  elevation="0"
                >
                  {{ countryFilter === 'ALL' ? 'Filter Country' : `Country: ${countryFilter}` }}
                </v-btn>
              </template>
              <v-list
                density="compact"
                rounded="lg"
                elevation="3"
                class="filter-menu"
              >
                <v-list-item
                  title="All Countries"
                  :active="countryFilter === 'ALL'"
                  @click="countryFilter = 'ALL'"
                />
                <v-divider class="my-1" />
                <v-list-item
                  v-for="country in availableCountries"
                  :key="country"
                  :title="country"
                  :active="countryFilter === country"
                  @click="countryFilter = country"
                >
                  <template #prepend>
                    <v-icon
                      icon="mdi-map-marker"
                      size="16"
                      class="mr-2 text-slate-500"
                    />
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-menu location="bottom end">
              <template #activator="{ props: menuProps }">
                <v-btn
                  v-bind="menuProps"
                  variant="outlined"
                  class="control-btn"
                  prepend-icon="mdi-sort-alphabetical-variant"
                  elevation="0"
                >
                  {{ sortButtonLabel }}
                </v-btn>
              </template>
              <v-list
                density="compact"
                rounded="lg"
                elevation="3"
                class="filter-menu"
              >
                <v-list-item
                  title="Name (A - Z)"
                  :active="sortBy === 'NAME_ASC'"
                  @click="sortBy = 'NAME_ASC'"
                >
                  <template #prepend>
                    <v-icon
                      icon="mdi-sort-alphabetical-ascending"
                      size="18"
                      class="mr-2"
                    />
                  </template>
                </v-list-item>
                <v-list-item
                  title="Name (Z - A)"
                  :active="sortBy === 'NAME_DESC'"
                  @click="sortBy = 'NAME_DESC'"
                >
                  <template #prepend>
                    <v-icon
                      icon="mdi-sort-alphabetical-descending"
                      size="18"
                      class="mr-2"
                    />
                  </template>
                </v-list-item>
                <v-divider class="my-1" />
                <v-list-item
                  title="Reset Sort (Default)"
                  :active="sortBy === 'DEFAULT'"
                  @click="sortBy = 'DEFAULT'"
                />
              </v-list>
            </v-menu>
          </div>
        </header>

        <div
          v-if="isFilterActive"
          class="active-filters-bar mb-6 d-flex align-center flex-wrap ga-2"
        >
          <span class="text-caption font-weight-medium text-slate-500 mr-1">Active filters:</span>
          <v-chip
            v-if="filterQuery"
            size="small"
            closable
            color="primary"
            variant="tonal"
            @click:close="filterQuery = ''"
          >
            Keyword: "{{ filterQuery }}"
          </v-chip>
          <v-chip
            v-if="countryFilter !== 'ALL'"
            size="small"
            closable
            color="primary"
            variant="tonal"
            @click:close="countryFilter = 'ALL'"
          >
            Country: {{ countryFilter }}
          </v-chip>
          <v-chip
            v-if="sortBy !== 'DEFAULT'"
            size="small"
            closable
            color="primary"
            variant="tonal"
            @click:close="sortBy = 'DEFAULT'"
          >
            Sorted: {{ sortBy === 'NAME_ASC' ? 'A to Z' : 'Z to A' }}
          </v-chip>
          <v-btn
            variant="text"
            size="x-small"
            color="primary"
            class="ml-2 font-weight-bold"
            @click="resetFilters"
          >
            Clear All
          </v-btn>
        </div>

        <LoadingState
          v-if="loading"
          :count="6"
        />

        <ErrorState
          v-else-if="error"
          :message="error"
          @retry="fetchRockets"
        />
        <template v-else>
          <v-container
            v-if="filteredRockets.length === 0"
            class="d-flex flex-column align-center justify-center py-16"
          >
            <v-icon
              icon="mdi-magnify-close"
              size="64"
              color="blue-grey-lighten-2"
              class="mb-4"
            />
            <h2 class="text-h5 font-weight-bold text-slate-800 mb-2">
              No launch vehicles found
            </h2>
            <p
              class="text-body-2 text-medium-emphasis mb-6 text-center"
              style="max-width: 420px;"
            >
              No rockets match your current search criteria. Try modifying your search query or clearing active filters.
            </p>
            <v-btn
              variant="outlined"
              color="primary"
              rounded="lg"
              @click="resetFilters"
            >
              Reset All Filters
            </v-btn>
          </v-container>

          <v-row
            v-else
            class="rockets-grid"
          >
            <v-col
              v-for="rocket in filteredRockets"
              :key="rocket.id"
              cols="12"
              sm="6"
              md="4"
              class="d-flex"
            >
              <RocketCard :rocket="rocket" />
            </v-col>
          </v-row>
        </template>
      </v-container>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useRockets } from '@/composables/useRockets'

const {
  loading,
  error,
  filterQuery,
  countryFilter,
  sortBy,
  availableCountries,
  filteredRockets,
  hasFetched,
  fetchRockets,
  resetFilters,
} = useRockets()

const sortButtonLabel = computed(() => {
  if (sortBy.value === 'NAME_ASC') return 'Sort: A - Z'
  if (sortBy.value === 'NAME_DESC') return 'Sort: Z - A'
  return 'Sort'
})

const isFilterActive = computed(() => {
  return !!filterQuery.value || countryFilter.value !== 'ALL' || sortBy.value !== 'DEFAULT'
})

onMounted(() => {
  document.title = 'AstroFleet - SpaceX Launch Vehicles'
  if (!hasFetched.value) {
    fetchRockets()
  }
})
</script>

<style scoped>
.fleet-page {
  min-height: 100vh;
  background-color: #f8fafc;
  color: #0f172a;
}

.fleet-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.fleet-header__text {
  flex: 1;
  min-width: 280px;
}

.fleet-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin-bottom: 8px;
}

.fleet-subtitle {
  font-size: 1rem;
  color: #64748b;
  max-width: 580px;
  line-height: 1.55;
  margin: 0;
}

.fleet-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-btn {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  color: #334155 !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  text-transform: none !important;
  border-radius: 8px !important;
  height: 38px !important;
  padding: 0 16px !important;
  letter-spacing: normal !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;
}

.control-btn:hover {
  background: #f8fafc !important;
  border-color: #cbd5e1 !important;
}

.filter-menu {
  border: 1px solid #e2e8f0;
}

.rockets-grid {
  margin: 0 -12px;
}

@media (max-width: 768px) {
  .fleet-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .fleet-controls {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>

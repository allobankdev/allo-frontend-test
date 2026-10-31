<template>
  <v-container class="py-6 py-md-10 max-width-xl">
    <!-- 1. HERO SECTION (SINEMATIK DENGAN BACKGROUND GAMBAR & DARK VIGNETTE) -->
    <v-card
      class="hero-banner rounded-2xl mb-6 overflow-hidden elevation-4"
      border
    >
      <v-img
        src="/hero-bg.jpg"
        cover
        min-height="300"
        class="hero-image"
        alt="SpaceX Launch Complex"
      >
        <div class="hero-overlay pa-6 pa-md-10 fill-height d-flex flex-column justify-center">
          <v-row align="center">
            <v-col
              cols="12"
              md="8"
            >
              <div class="d-flex align-center flex-wrap ga-2 mb-3">
                <v-chip
                  color="primary"
                  variant="flat"
                  size="small"
                  class="font-weight-bold text-uppercase text-black"
                >
                  <v-icon
                    start
                    icon="mdi-bank"
                    size="14"
                  />
                  Allo Bank Assessment
                </v-chip>
                <v-chip
                  color="white"
                  variant="outlined"
                  size="small"
                  class="font-weight-medium bg-black-opacity-50"
                >
                  <v-icon
                    start
                    icon="mdi-api"
                    size="14"
                  />
                  LL2 API v2.2.0 Detailed
                </v-chip>
              </div>

              <h1 class="text-h4 text-sm-h3 text-md-h2 font-weight-black text-white tracking-tight mb-3 text-shadow">
                SpaceX Rocket Fleet
              </h1>

              <p class="text-body-1 text-grey-lighten-2 max-w-prose mb-5 text-shadow-sm">
                Katalog dan spesifikasi komprehensif armada peluncur antariksa SpaceX, dari peluncur perintis Falcon 1 hingga sistem peluncuran antariksa masa depan Starship.
              </p>

              <!-- Tombol CTA diletakkan rapi di bawah deskripsi teks (Persis seperti referensi mychess.events) -->
              <div>
                <AddRocketDialog @created="onRocketAdded" />
              </div>
            </v-col>
          </v-row>
        </div>
      </v-img>
    </v-card>

    <!-- 2. FLOATING FEATURE & METRICS BAR (AKSEN GOLD/AMBER HARMONIS) -->
    <v-card
      class="mb-8 rounded-xl elevation-2 border bg-surface"
    >
      <v-row
        no-gutters
        class="divide-cols"
      >
        <v-col
          cols="6"
          sm="3"
          class="pa-4 text-center stat-col"
        >
          <div class="d-flex align-center justify-center ga-2 mb-1">
            <v-icon
              icon="mdi-rocket-launch"
              color="primary"
              size="20"
            />
            <span class="text-h6 font-weight-bold">{{ rocketStore.totalCount }}</span>
          </div>
          <div class="text-caption text-medium-emphasis font-weight-medium">
            Total Armada
          </div>
        </v-col>

        <v-col
          cols="6"
          sm="3"
          class="pa-4 text-center stat-col"
        >
          <div class="d-flex align-center justify-center ga-2 mb-1">
            <v-icon
              icon="mdi-check-decagram"
              color="primary"
              size="20"
            />
            <span class="text-h6 font-weight-bold">{{ rocketStore.spacexCount }}</span>
          </div>
          <div class="text-caption text-medium-emphasis font-weight-medium">
            SpaceX Resmi
          </div>
        </v-col>

        <v-col
          cols="6"
          sm="3"
          class="pa-4 text-center stat-col"
        >
          <div class="d-flex align-center justify-center ga-2 mb-1">
            <v-icon
              icon="mdi-star"
              color="primary"
              size="20"
            />
            <span class="text-h6 font-weight-bold">{{ rocketStore.customCount }}</span>
          </div>
          <div class="text-caption text-medium-emphasis font-weight-medium">
            Roket Kustom
          </div>
        </v-col>

        <v-col
          cols="6"
          sm="3"
          class="pa-4 text-center stat-col"
        >
          <div class="d-flex align-center justify-center ga-2 mb-1">
            <v-icon
              icon="mdi-database-check"
              color="primary"
              size="20"
            />
            <span class="text-h6 font-weight-bold">Tersinkron</span>
          </div>
          <div class="text-caption text-medium-emphasis font-weight-medium">
            Penyimpanan Lokal
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- 3. SEARCH & QUICK FILTER SECTION -->
    <v-card
      class="pa-4 pa-sm-5 mb-8 rounded-xl elevation-1 border bg-surface"
    >
      <v-row
        align="center"
        dense
      >
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="searchQuery"
            placeholder="Cari roket berdasarkan nama atau deskripsi..."
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            density="comfortable"
            variant="solo-filled"
            flat
            rounded="lg"
            class="search-input"
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
          class="d-flex align-center justify-start justify-md-end flex-wrap ga-2 mt-2 mt-md-0"
        >
          <!-- Quick Category Filter Chips -->
          <v-btn-toggle
            v-model="activeCategory"
            mandatory
            density="comfortable"
            variant="outlined"
            divided
            rounded="lg"
            color="primary"
          >
            <v-btn
              value="all"
              size="small"
              class="font-weight-medium"
            >
              Semua ({{ rocketStore.totalCount }})
            </v-btn>
            <v-btn
              value="spacex"
              size="small"
              class="font-weight-medium"
            >
              SpaceX ({{ rocketStore.spacexCount }})
            </v-btn>
            <v-btn
              value="custom"
              size="small"
              class="font-weight-medium"
            >
              Kustom ({{ rocketStore.customCount }})
            </v-btn>
          </v-btn-toggle>

          <v-chip
            color="primary"
            variant="tonal"
            size="small"
            class="font-weight-bold"
          >
            {{ rocketStore.filteredRockets.length }} Roket
          </v-chip>
        </v-col>
      </v-row>
    </v-card>

    <!-- 4. UI STATE: LOADING SKELETON -->
    <v-row v-if="rocketStore.isLoading">
      <v-col
        v-for="n in 6"
        :key="n"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketSkeleton />
      </v-col>
    </v-row>

    <!-- 5. UI STATE: ERROR WITH RETRY BUTTON -->
    <ErrorState
      v-else-if="rocketStore.error"
      title="Gagal Memuat Katalog Roket"
      :message="rocketStore.error"
      :loading="rocketStore.isLoading"
      @retry="rocketStore.fetchRockets(true)"
    />

    <!-- 6. UI STATE: EMPTY SEARCH / FILTER RESULT -->
    <v-card
      v-else-if="rocketStore.filteredRockets.length === 0"
      class="pa-10 text-center rounded-xl elevation-1 border my-6 bg-surface"
    >
      <v-avatar
        color="primary-lighten-5"
        size="64"
        class="mb-4 text-primary"
      >
        <v-icon
          icon="mdi-magnify-close"
          size="36"
        />
      </v-avatar>
      <h3 class="text-h6 font-weight-bold mb-2">
        Tidak Ada Roket yang Cocok
      </h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        Tidak ditemukan roket untuk kriteria pencarian saat ini. Silakan atur ulang kata kunci atau filter.
      </p>
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-refresh"
        class="font-weight-medium rounded-lg"
        @click="resetFilters"
      >
        Reset Filter
      </v-btn>
    </v-card>

    <!-- 7. UI STATE: SUCCESS ROCKETS CATALOG GRID -->
    <v-row v-else>
      <v-col
        v-for="rocket in rocketStore.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        class="d-flex"
      >
        <RocketCard
          :rocket="rocket"
          @select="navigateToDetail"
        />
      </v-col>
    </v-row>

    <!-- Snackbar Notification for Added Rocket -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      color="primary"
      location="bottom right"
      timeout="3500"
      rounded="pill"
      class="text-black"
    >
      <v-icon
        start
        icon="mdi-check-circle"
        color="black"
      />
      <span class="font-weight-bold text-black">
        Roket baru berhasil ditambahkan ke katalog aplikasi!
      </span>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import RocketCard from '@/components/RocketCard.vue'
import RocketSkeleton from '@/components/RocketSkeleton.vue'
import ErrorState from '@/components/ErrorState.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'

const router = useRouter()
const rocketStore = useRocketStore()
const showSuccessSnackbar = ref(false)

const searchQuery = computed({
  get: () => rocketStore.searchQuery,
  set: (val: string) => rocketStore.setSearchQuery(val || ''),
})

const activeCategory = computed({
  get: () => rocketStore.categoryFilter,
  set: (val: 'all' | 'spacex' | 'custom') => rocketStore.setCategoryFilter(val || 'all'),
})

onMounted(() => {
  rocketStore.initCustomRockets()
  rocketStore.fetchRockets()
})

function navigateToDetail(id: string | number) {
  router.push(`/rockets/${id}`)
}

function onRocketAdded() {
  showSuccessSnackbar.value = true
}

function resetFilters() {
  rocketStore.setSearchQuery('')
  rocketStore.setCategoryFilter('all')
}
</script>

<style scoped>
.max-width-xl {
  max-width: 1240px;
}

.max-w-prose {
  max-width: 650px;
}

.tracking-tight {
  letter-spacing: -0.025em;
}

.hero-banner {
  position: relative;
  border-color: rgba(229, 169, 60, 0.25) !important;
}

.hero-overlay {
  background: linear-gradient(90deg, rgba(11, 14, 20, 0.94) 0%, rgba(11, 14, 20, 0.85) 50%, rgba(11, 14, 20, 0.6) 100%);
}

.text-shadow {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
}

.text-shadow-sm {
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
}

.bg-black-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(4px);
}

.stat-col {
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.stat-col:last-child {
  border-right: none;
}

@media (max-width: 600px) {
  .stat-col:nth-child(2) {
    border-right: none;
  }
}
</style>

<template>
  <v-container class="page-container py-10 py-md-16">
    <section class="hero mb-10 mb-md-14">
      <v-chip
        class="mb-5"
        color="secondary"
        prepend-icon="mdi-earth"
        variant="tonal"
      >
        Launch Library 2
      </v-chip>
      <h1 class="hero__title font-weight-black">
        Jelajahi armada<br><span>roket SpaceX</span>
      </h1>
      <p class="hero__subtitle mt-5">
        Temukan informasi kendaraan peluncur SpaceX, dari penerbangan pertama
        hingga biaya setiap peluncurannya.
      </p>
    </section>

    <div class="toolbar d-flex flex-column flex-sm-row align-stretch align-sm-center ga-3 mb-8">
      <v-text-field
        v-model="search"
        aria-label="Cari roket"
        class="search-field"
        clearable
        hide-details
        placeholder="Cari nama atau deskripsi roket..."
        prepend-inner-icon="mdi-magnify"
        rounded="lg"
        variant="outlined"
      />
      <v-btn
        color="primary"
        height="56"
        prepend-icon="mdi-plus"
        rounded="lg"
        size="large"
        @click="formOpen = true"
      >
        Tambah roket
      </v-btn>
    </div>

    <div
      v-if="store.loading"
      aria-label="Memuat data roket"
    >
      <div class="d-flex align-center ga-3 mb-5 text-medium-emphasis">
        <v-progress-circular
          color="primary"
          indeterminate
          size="22"
          width="2"
        />
        <span>Memuat data roket...</span>
      </div>
      <v-row>
        <v-col
          v-for="index in 6"
          :key="index"
          cols="12"
          sm="6"
          lg="4"
        >
          <v-skeleton-loader
            class="skeleton-card"
            type="image, article, actions"
          />
        </v-col>
      </v-row>
    </div>

    <ErrorState
      v-else-if="store.error"
      :message="store.error"
      @retry="store.fetchRockets(true)"
    />

    <section v-else>
      <div class="d-flex align-center justify-space-between mb-5">
        <h2 class="text-h5 font-weight-bold">
          Daftar roket
        </h2>
        <span class="text-body-2 text-medium-emphasis">
          {{ filteredRockets.length }} roket
        </span>
      </div>

      <v-row v-if="filteredRockets.length">
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <RocketCard
            :rocket="rocket"
            @select="openDetail"
          />
        </v-col>
      </v-row>

      <v-sheet
        v-else
        class="empty-state pa-10 text-center"
        rounded="xl"
      >
        <v-icon
          color="primary"
          size="56"
        >
          mdi-rocket-outline
        </v-icon>
        <h3 class="mt-4 text-h6 font-weight-bold">
          Roket tidak ditemukan
        </h3>
        <p class="mt-2 text-medium-emphasis">
          Coba gunakan kata kunci lain atau hapus pencarian.
        </p>
        <v-btn
          class="mt-4"
          color="primary"
          variant="tonal"
          @click="search = ''"
        >
          Hapus pencarian
        </v-btn>
      </v-sheet>
    </section>

    <RocketFormDialog
      v-model="formOpen"
      @submit="addRocket"
    />

    <v-snackbar
      v-model="snackbarOpen"
      color="success"
      timeout="3000"
    >
      Roket berhasil ditambahkan ke daftar.
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import ErrorState from '@/components/common/ErrorState.vue'
  import {
    RocketCard,
    RocketFormDialog,
    useRocketStore,
  } from '@/features/rockets'
  import type { NewRocketInput, Rocket } from '@/features/rockets'

  const router = useRouter()
  const store = useRocketStore()
  const search = ref('')
  const formOpen = ref(false)
  const snackbarOpen = ref(false)

  const filteredRockets = computed(() => {
    const keyword = search.value?.trim().toLowerCase() ?? ''
    if (!keyword) return store.allRockets

    return store.allRockets.filter(rocket => (
      rocket.full_name.toLowerCase().includes(keyword)
      || rocket.description?.toLowerCase().includes(keyword)
    ))
  })

  function openDetail (rocket: Rocket) {
    router.push(`/rockets/${rocket.id}`)
  }

  function addRocket (input: NewRocketInput) {
    store.addRocket(input)
    snackbarOpen.value = true
  }

  onMounted(() => {
    store.fetchRockets()
  })
</script>

<style scoped>
.page-container {
  max-width: 1180px;
}

.hero {
  max-width: 780px;
}

.hero__title {
  font-size: clamp(2.6rem, 7vw, 5.3rem);
  line-height: 0.98;
  letter-spacing: -0.055em;
}

.hero__title span {
  color: #7ee7d8;
}

.hero__subtitle {
  max-width: 650px;
  color: rgba(255, 255, 255, 0.67);
  font-size: clamp(1rem, 2vw, 1.18rem);
  line-height: 1.7;
}

.toolbar {
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: rgba(17, 27, 49, 0.72);
  backdrop-filter: blur(14px);
}

.search-field {
  flex: 1;
}

.skeleton-card,
.empty-state {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(17, 27, 49, 0.72);
}
</style>

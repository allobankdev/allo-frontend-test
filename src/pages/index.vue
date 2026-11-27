<template>
  <v-container>
    <header class="mb-8">
      <p class="text-overline text-primary mb-2">
        The Space Devs
      </p>
      <h1 class="text-h3 font-weight-bold mb-3">
        Daftar roket
      </h1>
      <p class="text-body-1 text-medium-emphasis">
        13 roket yang tersedia di Launch Library 2 API.
      </p>
    </header>

    <div class="d-flex flex-wrap ga-3 justify-space-between align-center mb-4">
      <v-btn class="mb-4" color="primary" prepend-icon="mdi-plus" @click="showAddRocket = true">
        Tambah roket
      </v-btn>
      <v-btn class="mb-4" prepend-icon="mdi-filter-variant" :aria-expanded="showFilters" aria-controls="rocket-filters"
        :variant="showFilters ? 'tonal' : 'outlined'" @click="showFilters = !showFilters">
        {{ showFilters ? 'Tutup filter' : 'Filter roket' }}
      </v-btn>
    </div>

    <v-dialog v-model="showAddRocket" max-width="640" aria-label="Tambah roket">
      <AddRocketForm v-if="showAddRocket" :families="families" @save="saveRocket" @cancel="showAddRocket = false" />
    </v-dialog>

    <v-snackbar v-model="showSuccess" role="status">
      Roket berhasil ditambahkan.
    </v-snackbar>

    <v-expand-transition>
      <v-card v-show="showFilters" id="rocket-filters" class="pa-4 mb-6" variant="outlined" tag="section"
        aria-label="Filter roket">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="search" label="Search" placeholder="Cari nama atau deskripsi roket"
              prepend-inner-icon="mdi-magnify" clearable hide-details />
          </v-col>
          <v-col cols="12" md="6">
            <v-select v-model="family" label="Family" :items="families" clearable placeholder="Semua family"
              hide-details />
          </v-col>
          <v-col cols="12" md="6">
            <p id="active-filter-label" class="text-body-2 mb-2">
              Active
            </p>
            <v-btn-toggle v-model="active" aria-labelledby="active-filter-label" color="primary" mandatory divided
              variant="outlined">
              <v-btn value="all">
                Semua
              </v-btn>
              <v-btn value="yes">
                Aktif
              </v-btn>
              <v-btn value="no">
                Tidak aktif
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="12" md="6">
            <p id="reusable-filter-label" class="text-body-2 mb-2">
              Reusable
            </p>
            <v-btn-toggle v-model="reusable" aria-labelledby="reusable-filter-label" color="primary" mandatory divided
              variant="outlined">
              <v-btn value="all">
                Semua
              </v-btn>
              <v-btn value="yes">
                Ya
              </v-btn>
              <v-btn value="no">
                Tidak
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-btn class="mt-4" variant="text" @click="resetFilters">
          Reset filter
        </v-btn>
      </v-card>
    </v-expand-transition>

    <div v-if="loading" class="py-16 text-center" role="status">
      <v-progress-circular color="primary" indeterminate />
      <p class="mt-4">
        Sedang memuat...
      </p>
    </div>

    <v-alert v-else-if="error" role="alert" type="error" variant="tonal">
      <p>{{ error }}</p>
      <v-btn class="mt-3" variant="outlined" @click="loadRockets">
        Coba lagi
      </v-btn>
    </v-alert>

    <template v-if="!loading && (!error || rockets.length)">
      <p class="text-body-2 text-medium-emphasis mb-4" role="status">
        {{ filteredRockets.length }} dari {{ rockets.length }} roket
      </p>
      <v-row v-if="filteredRockets.length">
        <v-col v-for="rocket in filteredRockets" :key="rocket.id" cols="12" md="6" lg="4">
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
      <v-alert v-else type="info" variant="tonal">
        {{ rockets.length ? 'Tidak ada roket yang sesuai dengan filter.' : 'Data tidak tersedia.' }}
      </v-alert>
    </template>

    <v-footer class="mt-8 text-caption text-medium-emphasis">
      <a href="https://thespacedevs.com/llapi" target="_blank" rel="noopener noreferrer">
        Launch Library 2 API by The Space Devs
      </a>
    </v-footer>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRockets } from '@/composables/useRockets'
import type { NewRocketInput } from '@/types/rocket'
import { textValue } from '@/utils/rocketDisplay'

const { rockets, loading, error, loadRockets, addRocket } = useRockets()

const showAddRocket = ref(false)
const showSuccess = ref(false)

function saveRocket(input: NewRocketInput) {
  addRocket(input)
  resetFilters()
  showAddRocket.value = false
  showSuccess.value = true
}

type BooleanFilter = 'all' | 'yes' | 'no'

const showFilters = ref(false)
const search = ref<string | null>('')
const active = ref<BooleanFilter>('all')
const reusable = ref<BooleanFilter>('all')
const family = ref<string | null>(null)

const families = computed(() => [...new Set(
  rockets.value.map(rocket => textValue(rocket.family)).filter(Boolean),
)].sort())

const filteredRockets = computed(() => {
  const query = search.value?.trim().toLowerCase() || ''

  return rockets.value.filter(rocket => {
    const matchesSearch = !query || [rocket.full_name, rocket.name, rocket.description]
      .some(value => textValue(value).toLowerCase().includes(query))
    const matchesActive = active.value === 'all' || rocket.active === (active.value === 'yes')
    const matchesReusable = reusable.value === 'all' || rocket.reusable === (reusable.value === 'yes')
    const matchesFamily = !family.value || textValue(rocket.family) === family.value

    return matchesSearch && matchesActive && matchesReusable && matchesFamily
  })
})

function resetFilters() {
  search.value = ''
  active.value = 'all'
  reusable.value = 'all'
  family.value = null
}

onMounted(() => {
  void loadRockets()
})
</script>

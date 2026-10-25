<template>
  <v-container class="py-6">
    <!-- Top Action Bar: Search Input Ringkas + Tombol Tambah Roket -->
    <v-row class="mb-6 align-center justify-space-between" density="compact">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-text-field
          v-model="searchQuery"
          placeholder="Filter rockets..."
          prepend-inner-icon="mdi-magnify"
          clearable
          variant="outlined"
          density="compact"
          hide-details
          rounded="0"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="4" md="auto" class="d-flex justify-sm-end">
        <AddRocketDialog />
      </v-col>
    </v-row>

    <!-- State 1: UI Loading Spinner -->
    <LoadingState v-if="rocketStore.loading" message="Fetching rockets from SpaceX API..." />

    <!-- State 2: UI Error + Tombol Retry -->
    <ErrorState
      v-else-if="rocketStore.error"
      :message="rocketStore.error"
      @retry="handleRetry"
    />

    <!-- State 3: Tampilan jika hasil pencarian kosong -->
    <v-container v-else-if="rocketStore.filteredRockets.length === 0" class="text-center py-12">
      <v-icon size="64" color="grey" icon="mdi-rocket-outline" class="mb-2"></v-icon>
      <h3 class="text-h6 font-weight-bold text-medium-emphasis">No rockets found</h3>
      <p class="text-body-2 text-medium-emphasis">
        Try adjusting your filter search query.
      </p>
    </v-container>

    <!-- State 4: Sukses - Grid Daftar Card Roket -->
    <v-row v-else>
      <v-col
        v-for="rocket in rocketStore.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import RocketCard from '@/components/RocketCard.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

// Inisialisasi Pinia store untuk data roket
const rocketStore = useRocketStore()

// Computed property dua arah (getter & setter) untuk v-model search input
const searchQuery = computed({
  get: () => rocketStore.searchQuery,
  set: (val: string) => {
    rocketStore.searchQuery = val || ''
  },
})

// Lifecycle hook: Ambil data roket dari API saat pertama kali komponen dimuat
onMounted(() => {
  if (rocketStore.rockets.length === 0) {
    rocketStore.fetchRockets()
  }
})

// Handler untuk tombol Retry jika fetch API mengalami error
const handleRetry = () => {
  rocketStore.fetchRockets()
}
</script>

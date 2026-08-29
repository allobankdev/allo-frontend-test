<template>
  <v-container>
    <!-- Filter -->
    <RocketFilter v-model="filter" class="mb-4" />

    <!-- Tombol Tambah -->
    <v-btn color="primary" class="mb-6" @click="dialog = true">
      Tambah Rocket
    </v-btn>

    <!-- Loading -->
    <LoadingState v-if="loading" />

    <!-- Error -->
    <v-alert v-if="error" type="error" class="mb-4">
      {{ error }}
      <v-btn variant="text" @click="loadRockets">Coba Lagi</v-btn>
    </v-alert>

    <!-- Daftar Rocket -->
    <v-row v-if="!loading && !error">
      <template v-if="filteredRockets.length">
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          md="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </template>
      <v-col v-else cols="12">
        <v-alert type="info">Data tidak ditemukan</v-alert>
      </v-col>
    </v-row>

    <!-- Modal Tambah Rocket -->
    <RocketForm
      v-model:modelValue="dialog"
      @submit="addRocket"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchRockets } from '@/api/spacex'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import LoadingState from '@/components/LoadingState.vue'
import RocketForm from '@/components/RocketForm.vue'
import { getLocalRockets, saveLocalRocket } from '@/utils/rocketStorage'

const rockets = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const filter = ref('')
const dialog = ref(false)

// Load data rockets
onMounted(loadRockets)
async function loadRockets() {
  loading.value = true
  error.value = ''
  try {
    const api = await fetchRockets()
    rockets.value = [
      ...api.map((r: any) => ({ ...r, isApi: true })),
      ...getLocalRockets(),
    ]
  } catch {
    error.value = 'Gagal memuat data roket'
  } finally {
    loading.value = false
  }
}

// Filter rockets
const filteredRockets = computed(() =>
  rockets.value.filter(r =>
    r.name.toLowerCase().includes((filter.value ?? '').toLowerCase())
  )
)

// Fungsi untuk menambahkan rocket baru dari RocketForm
function addRocket(rocket: any) {
  saveLocalRocket(rocket)      
  rockets.value.push(rocket)
}
</script>
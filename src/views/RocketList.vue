<template>
  <v-container>
    <h1 class="text-center my-5">SpaceX Rockets 🚀</h1>
    
    <!-- Fitur Filter & Add -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field v-model="search" label="Cari roket..." prepend-inner-icon="mdi-magnify" variant="outlined" hide-details></v-text-field>
      </v-col>
      <v-col cols="12" md="6" class="d-flex align-center">
        <v-btn color="success" block @click="showAddDialog = true">Tambah Roket Baru</v-btn>
      </v-col>
    </v-row>

    <!-- Tampilan Loading -->
    <v-row justify="center" v-if="loading">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-row>

    <!-- Tampilan Error -->
    <v-row justify="center" v-else-if="error">
      <v-alert type="error" variant="tonal">
        Gagal mengambil data. <v-btn @click="fetchRockets" color="primary">Retry</v-btn>
      </v-alert>
    </v-row>

    <!-- Tampilan Sukses (List Roket) -->
    <v-row v-else>
      <v-col cols="12" md="4" v-for="rocket in filteredRockets" :key="rocket.id">
        <v-card hover class="fill-height d-flex flex-column">
          <v-img :src="rocket.image_url || 'https://via.placeholder.com/300x200?text=No+Image'" height="200" cover></v-img>
          <v-card-title>{{ rocket.full_name }}</v-card-title>
          <v-card-text class="text-truncate flex-grow-1">{{ rocket.description }}</v-card-text>
          <v-card-actions>
            <router-link :to="`/rocket/${rocket.id}`" style="text-decoration: none; width: 100%;">
              <v-btn color="primary" block>Lihat Detail</v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog Tambah Roket -->
    <v-dialog v-model="showAddDialog" max-width="500">
      <v-card>
        <v-card-title>Tambah Roket Baru</v-card-title>
        <v-card-text>
          <v-text-field v-model="newRocket.name" label="Nama Roket" variant="outlined"></v-text-field>
          <v-text-field v-model="newRocket.description" label="Deskripsi" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="showAddDialog = false">Batal</v-btn>
          <v-btn color="success" @click="addNewRocket">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const rockets = ref<any[]>([])
const loading = ref(false)
const error = ref(false)

// Fitur Filter
const search = ref('')
const filteredRockets = computed(() => {
  return rockets.value.filter(r => r.full_name.toLowerCase().includes(search.value.toLowerCase()))
})

// Fitur Tambah Roket
const showAddDialog = ref(false)
const newRocket = ref({ name: '', description: '' })
const addNewRocket = () => {
  if (newRocket.value.name) {
    rockets.value.unshift({
      id: Date.now().toString(),
      full_name: newRocket.value.name,
      description: newRocket.value.description,
      image_url: null // Biar keliatan handling data kosongnya
    })
    newRocket.value = { name: '', description: '' }
    showAddDialog.value = false
  }
}

const fetchRockets = async () => {
  loading.value = true
  error.value = false
  try {
    const response = await axios.get('https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20')
    rockets.value = response.data.results
  } catch (err) {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRockets()
})
</script>
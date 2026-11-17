<template>
  <v-container>
    <v-btn color="primary" class="mb-5" @click="$router.push('/')">Kembali ke List</v-btn>
    
    <v-row justify="center" v-if="loading">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-row>

    <v-row justify="center" v-else-if="error">
      <v-alert type="error" variant="tonal">
        Gagal mengambil detail roket. <v-btn @click="fetchRocketDetail" color="primary">Retry</v-btn>
      </v-alert>
    </v-row>

    <v-card v-else-if="rocket" class="mx-auto" max-width="800">
      <v-img :src="rocket.image_url || 'https://via.placeholder.com/800x400?text=No+Image'" height="400" cover></v-img>
      <v-card-title class="text-h4">{{ rocket.full_name }}</v-card-title>
      <v-card-text>
        <p class="text-body-1 mb-4">{{ rocket.description }}</p>
        
        <v-divider class="my-4"></v-divider>
        
        <v-row>
          <v-col cols="12" md="4">
            <strong>Cost per launch:</strong><br>
            {{ rocket.launch_cost ? `$${rocket.launch_cost}` : 'Data tidak tersedia' }}
          </v-col>
          <v-col cols="12" md="4">
            <strong>Country:</strong><br>
            {{ rocket.manufacturer?.country_code || 'Data tidak tersedia' }}
          </v-col>
          <v-col cols="12" md="4">
            <strong>First Flight:</strong><br>
            {{ rocket.maiden_flight || 'Data tidak tersedia' }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const rocket = ref<any>(null)
const loading = ref(false)
const error = ref(false)

const fetchRocketDetail = async () => {
  loading.value = true
  error.value = false
  try {
    // Kalau id-nya buatan sendiri (hasil add), kita bikin dummy data aja
    if (route.params.id.toString().length > 10) {
       rocket.value = {
         full_name: "Roket Buatan Sendiri",
         description: "Ini roket yang kamu tambahin di halaman list.",
         image_url: null,
         launch_cost: null,
         manufacturer: null,
         maiden_flight: null
       }
    } else {
       const response = await axios.get(`https://lldev.thespacedevs.com/2.2.0/config/launcher/${route.params.id}/`)
       rocket.value = response.data
    }
  } catch (err) {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRocketDetail()
})
</script>
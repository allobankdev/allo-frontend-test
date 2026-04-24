<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router/auto'
import { useRocketStore } from '@/store/rocketStore'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

console.log("Route params:", route.params.id);

const rocketId = route.params.id as string

const rocket = computed(() => store.detailedRocket(rocketId))

console.log("Selected rocket detail:", rocket.value);

onMounted(async () => {
  if (store.rockets.length === 0) {
    await store.fetchAllRockets()
  }
})

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <v-container>
    <v-row v-if="store.status === 'loading'" justify="center" align="center" style="height: 400px;">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>

    <v-alert v-else-if="store.status === 'error'" type="error" class="ma-4">
      Data gagal dimuat.
      <v-btn variant="text" @click="store.fetchAllRockets()">Coba Lagi</v-btn>
    </v-alert>

    <v-alert v-else-if="!rocket && store.status === 'success'" type="warning">
      Roket dengan ID ini tidak ditemukan.
      <v-btn variant="text" @click="goBack">Kembali</v-btn>
    </v-alert>

    <div v-else-if="rocket">
      <v-btn prepend-icon="mdi-arrow-left" variant="text" @click="goBack" class="mb-4">
        Kembali ke Daftar
      </v-btn>

      <v-row>
        <v-col cols="12" md="6">
          <v-carousel hide-delimiters show-arrows="hover" height="400">
            <v-carousel-item
              v-for="(img, i) in rocket.flickr_images"
              :key="i"
              :src="img"
              cover
            ></v-carousel-item>
          </v-carousel>
        </v-col>

        <v-col cols="12" md="6">
          <div class="d-flex align-center mb-2">
            <h1 class="text-h3 font-weight-bold">{{ rocket.name }}</h1>
            
          </div>

          <p class="text-body-1 text-grey-darken-1 mb-6">
            {{ rocket.description }}
          </p>

          <v-card variant="outlined" class="pa-4">
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-currency-usd"></v-icon>
                </template>
                <v-list-item-title>Cost Per Launch</v-list-item-title>
                <v-list-item-subtitle class="text-primary font-weight-bold">
                  ${{ rocket.cost_per_launch?.toLocaleString() }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-divider class="my-2"></v-divider>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-rocket-launch"></v-icon>
                </template>
                <v-list-item-title>First Flight</v-list-item-title>
                <v-list-item-subtitle>
                  {{ rocket.first_flight }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-divider class="my-2"></v-divider>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-flag"></v-icon>
                </template>
                <v-list-item-title>Country</v-list-item-title>
                <v-list-item-subtitle>
                  {{ rocket.country }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
</style>
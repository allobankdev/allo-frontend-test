<template>
  <v-container>
    <!-- Tombol Kembali -->
    <v-btn
      text
      prepend-icon="mdi-arrow-left"
      class="my-4"
      @click="$router.push('/')"
    >
      Kembali
    </v-btn>

    <!-- Loading -->
    <LoadingState v-if="loading" />

    <!-- Error -->
    <v-alert v-if="error" type="error" class="mb-4">
      {{ error }}
    </v-alert>

    <!-- Detail Rocket -->
    <v-card
      v-if="rocket"
      class="pa-4"
      elevation="6"
    >
      <v-row>
        <!-- Gambar Rocket -->
        <v-col cols="12" md="6">
          <v-img
            :src="rocket.flickr_images?.[0] || 'https://via.placeholder.com/400x300?text=Rocket'"
            height="300"
            cover
            class="rounded-lg"
          />
        </v-col>

        <!-- Info Rocket -->
        <v-col cols="12" md="6">
          <v-card-title class="text-h4 font-weight-bold mb-4">
            {{ rocket.name }}
          </v-card-title>

          <v-card-text class="mb-4">
            {{ rocket.description }}
          </v-card-text>

          <v-divider class="my-4" />

          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-medium">
                  Biaya Per Peluncuran
                </v-list-item-title>
                <v-list-item-subtitle>
                  ${{ rocket.cost_per_launch.toLocaleString() }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-medium">
                  Negara
                </v-list-item-title>
                <v-list-item-subtitle>{{ rocket.country }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-medium">
                  Penerbangan Pertama
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDateIndo(rocket.first_flight) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchRocketById } from '@/api/spacex'
import { getLocalRocketById } from '@/utils/rocketStorage'
import { formatDateIndo } from '@/utils/helper'
import LoadingState from '@/components/LoadingState.vue'

const route = useRoute()
const router = useRouter()
const rocket = ref<any>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const id = route.params.id as string
    rocket.value = id.startsWith('local-')
      ? getLocalRocketById(id)
      : await fetchRocketById(id)

    if (!rocket.value) throw new Error()
  } catch {
    error.value = 'Detail roket gagal dimuat'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.v-card-title {
  line-height: 1.2;
}

.v-img {
  border-radius: 12px;
}
</style>
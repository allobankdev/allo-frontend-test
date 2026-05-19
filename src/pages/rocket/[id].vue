<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const imgIndex = ref(0)
const imgError = ref(false)

onMounted(async () => {
  if (store.allRockets.length === 0) {
    await store.fetchRockets()
  }
})

const rocket = computed(() => store.getRocketById(route.params.id as string))

const currentImage = computed(() => {
  if (imgError.value || !rocket.value?.flickr_images?.length) return null
  return rocket.value.flickr_images[imgIndex.value] ?? rocket.value.flickr_images[0]
})

function prevImage() {
  if (!rocket.value?.flickr_images?.length) return
  imgIndex.value = (imgIndex.value - 1 + rocket.value.flickr_images.length) % rocket.value.flickr_images.length
  imgError.value = false
}

function nextImage() {
  if (!rocket.value?.flickr_images?.length) return
  imgIndex.value = (imgIndex.value + 1) % rocket.value.flickr_images.length
  imgError.value = false
}

function formatCurrency(val?: number) {
  if (!val) return '-'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val)
}
</script>

<template>
  <v-container class="py-8" max-width="900">
    <!-- Back button -->
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4 px-0"
      @click="router.back()"
    >
      Kembali
    </v-btn>

    <!-- Loading fallback -->
    <template v-if="store.isLoading">
      <v-skeleton-loader type="image, article" />
    </template>

    <!-- Not found -->
    <div
      v-else-if="!rocket"
      class="d-flex flex-column align-center justify-center py-16 ga-4"
    >
      <v-icon icon="mdi-rocket-off" size="64" color="error" />
      <p class="text-h6">Roket tidak ditemukan</p>
      <v-btn color="primary" @click="router.push('/')">Kembali ke Daftar</v-btn>
    </div>

    <!-- Rocket Detail -->
    <template v-else>
      <!-- Image Gallery -->
      <v-card rounded="lg" elevation="3" class="mb-6">
        <div class="position-relative">
          <v-img
            v-if="currentImage"
            :src="currentImage"
            height="400"
            cover
            @error="imgError = true"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular indeterminate color="grey-lighten-4" size="48" />
              </div>
            </template>
          </v-img>
          <v-img
            v-else
            src="https://placehold.co/900x400/1a1a2e/white?text=No+Image"
            height="400"
            cover
          />

          <!-- Gallery nav (only if multiple images) -->
          <template v-if="(rocket.flickr_images?.length ?? 0) > 1">
            <v-btn
              icon="mdi-chevron-left"
              variant="tonal"
              color="white"
              class="position-absolute"
              style="top: 50%; left: 12px; transform: translateY(-50%)"
              @click="prevImage"
            />
            <v-btn
              icon="mdi-chevron-right"
              variant="tonal"
              color="white"
              class="position-absolute"
              style="top: 50%; right: 12px; transform: translateY(-50%)"
              @click="nextImage"
            />
            <v-chip
              color="black"
              variant="tonal"
              size="small"
              class="position-absolute"
              style="bottom: 12px; right: 12px"
            >
              {{ imgIndex + 1 }} / {{ rocket.flickr_images.length }}
            </v-chip>
          </template>
        </div>
      </v-card>

      <!-- Info -->
      <v-row>
        <v-col cols="12" md="8">
          <div class="d-flex align-center ga-3 mb-2">
            <h1 class="text-h4 font-weight-bold">{{ rocket.name }}</h1>
            <v-chip
              :color="rocket.active ? 'success' : 'default'"
              variant="tonal"
              size="small"
            >
              {{ rocket.active ? 'Aktif' : 'Tidak Aktif' }}
            </v-chip>
            <v-chip v-if="rocket.isLocal" color="secondary" variant="tonal" size="small">
              Custom
            </v-chip>
          </div>

          <p class="text-body-1 text-medium-emphasis mb-6">{{ rocket.description }}</p>
        </v-col>

        <!-- Stats -->
        <v-col cols="12" md="4">
          <v-card rounded="lg" variant="tonal" color="primary">
            <v-list bg-color="transparent" lines="two">
              <v-list-item
                prepend-icon="mdi-earth"
                title="Negara"
                :subtitle="rocket.country || '-'"
              />
              <v-divider />
              <v-list-item
                prepend-icon="mdi-calendar"
                title="Penerbangan Pertama"
                :subtitle="rocket.first_flight || '-'"
              />
              <v-divider />
              <v-list-item
                prepend-icon="mdi-currency-usd"
                title="Biaya per Peluncuran"
                :subtitle="formatCurrency(rocket.cost_per_launch)"
              />
              <v-divider v-if="rocket.success_rate_pct !== undefined" />
              <v-list-item
                v-if="rocket.success_rate_pct !== undefined"
                prepend-icon="mdi-chart-line"
                title="Tingkat Keberhasilan"
                :subtitle="`${rocket.success_rate_pct}%`"
              />
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

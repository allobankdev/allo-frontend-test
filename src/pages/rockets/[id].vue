<template>
  <v-container>
    <v-btn class="mb-6 text-none" to="/" prepend-icon="mdi-arrow-left" variant="text">
      Kembali ke daftar roket
    </v-btn>

    <div v-if="loading" class="py-16 text-center" role="status">
      <v-progress-circular color="primary" indeterminate />
      <p class="mt-4">
        Sedang memuat...
      </p>
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal" role="alert">
      <p>{{ error }}</p>
      <v-btn class="mt-3" variant="outlined" @click="retry">
        Coba lagi
      </v-btn>
    </v-alert>

    <article v-else-if="rocket">
      <p class="text-overline text-primary mb-2">
        Detail roket
      </p>
      <h1 class="text-h3 font-weight-bold mb-6 detail-text">
        {{ rocketName(rocket) }}
      </h1>
      <v-row>
        <v-col cols="12" md="6">
          <v-img v-if="textValue(rocket.image_url) && !imageFailed" :src="textValue(rocket.image_url)"
            :alt="rocketName(rocket)" max-height="540" @error="imageFailed = true" />
          <v-sheet v-else class="pa-16 text-center" color="surface-variant">
            <v-icon icon="mdi-rocket-launch-outline" size="64" aria-hidden="true" />
            <p class="mt-4">
              Gambar tidak tersedia
            </p>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="6">
          <h2 class="text-h6 mb-3">
            Deskripsi
          </h2>
          <p class="text-body-1 mb-6 detail-text">
            {{ rocketDescription(rocket) }}
          </p>
          <v-sheet class="pa-5" rounded="lg">
            <dl>
              <dt class="text-body-2 text-medium-emphasis">
                Biaya per peluncuran
              </dt>
              <dd class="text-h6 mb-4">
                {{ launchCost }}
              </dd>
              <dt class="text-body-2 text-medium-emphasis">
                Negara
              </dt>
              <dd class="text-h6 mb-4">
                {{ country }}
              </dd>
              <dt class="text-body-2 text-medium-emphasis">
                Penerbangan pertama
              </dt>
              <dd class="text-h6">
                {{ firstFlight }}
              </dd>
            </dl>
          </v-sheet>
        </v-col>
      </v-row>
    </article>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketDetail } from '@/composables/useRocketDetail'
import { formatFirstFlight, formatLaunchCost, rocketDescription, rocketName, textValue } from '@/utils/rocketDisplay'

const route = useRoute('/rockets/[id]')

const { rocket, loading, error, retry } = useRocketDetail(() => String(route.params.id))

const imageFailed = ref(false)

watch(() => rocket.value?.image_url, () => { imageFailed.value = false })

const launchCost = computed(() => formatLaunchCost(rocket.value?.launch_cost))
const country = computed(() => textValue(rocket.value?.manufacturer?.country_code) || 'Data tidak tersedia.')
const firstFlight = computed(() => formatFirstFlight(rocket.value?.maiden_flight))
</script>

<style scoped>
.detail-text {
  white-space: pre-line;
  overflow-wrap: anywhere;
}
</style>

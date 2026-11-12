<template>
  <v-container class="py-6">
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      Kembali ke daftar
    </v-btn>

    <AsyncState
      :error="error"
      loading-text="Memuat detail rocket..."
      :status="status"
      @retry="retry"
    >
      <v-card v-if="rocket">
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
          >
            <RocketImage
              :alt="rocket.name"
              class="rocket-detail__image"
              :height="mdAndUp ? '100%' : 300"
              :src="rocket.imageUrl"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-card-item>
              <h1 class="text-h4 text-wrap">
                {{ rocket.name }}
              </h1>
            </v-card-item>

            <v-card-text>
              <p
                class="text-body-1 mb-4"
                :class="{ 'font-italic text-medium-emphasis': !rocket.description }"
              >
                {{ rocket.description ?? 'Deskripsi belum tersedia.' }}
              </p>

              <v-list
                bg-color="transparent"
                density="comfortable"
              >
                <v-list-item
                  v-for="spec in specs"
                  :key="spec.label"
                  :prepend-icon="spec.icon"
                  :subtitle="spec.label"
                >
                  <v-list-item-title :class="{ 'font-italic text-medium-emphasis': spec.missing }">
                    {{ spec.value }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </AsyncState>
  </v-container>
</template>

<script lang="ts" setup>
  /**
   * Layar detail rocket: gambar, nama, deskripsi, biaya per peluncuran,
   * negara, dan tanggal terbang perdana, lengkap dengan fallback untuk data kosong.
   */
  import { computed } from 'vue'
  import { useRoute } from 'vue-router/auto'
  import { useDisplay } from 'vuetify'
  import { useRocketDetail } from '@/composables/useRocketDetail'
  import { formatCountry, formatLaunchCost, formatMaidenFlight } from '@/utils/format'

  const route = useRoute('/rockets/[id]')
  const { rocket, status, error, retry } = useRocketDetail(() => route.params.id)
  // Di layar kecil gambar ditumpuk di atas info, jadi tingginya dibatasi agar tidak memanjang.
  const { mdAndUp } = useDisplay()

  const specs = computed(() => {
    if (!rocket.value) return []
    const { launchCost, countryCode, maidenFlight } = rocket.value

    return [
      {
        label: 'Biaya per peluncuran',
        icon: 'mdi-cash',
        value: formatLaunchCost(launchCost),
        missing: launchCost === null,
      },
      {
        label: 'Negara',
        icon: 'mdi-flag-outline',
        value: formatCountry(countryCode),
        missing: countryCode === null,
      },
      {
        label: 'Terbang perdana',
        icon: 'mdi-calendar',
        value: formatMaidenFlight(maidenFlight),
        missing: maidenFlight === null,
      },
    ]
  })
</script>

<style scoped>
  /* Di desktop gambar mengisi tinggi kolom; tinggi minimum menjaga gambar tetap terlihat. */
  .rocket-detail__image {
    min-height: 280px;
  }
</style>

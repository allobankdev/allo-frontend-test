<template>
  <v-container class="py-8">
    <!-- Back Button -->
    <v-btn
      class="mb-6"
      prepend-icon="mdi-arrow-left"
      variant="text"
      @click="router.push('/')"
    >
      Kembali ke Daftar
    </v-btn>

    <!-- Loading State -->
    <LoadingState
      v-if="rocketStore.detailLoading"
      message="Memuat detail roket..."
    />

    <!-- Error State -->
    <ErrorState
      v-else-if="rocketStore.detailError"
      :message="rocketStore.detailError"
      @retry="loadDetail()"
    />

    <!-- Rocket Not Found -->
    <v-container
      v-else-if="!rocketStore.selectedRocket"
      class="text-center py-12"
    >
      <v-icon
        color="grey"
        icon="mdi-rocket-outline"
        size="64"
      />
      <p class="text-body-1 text-medium-emphasis mt-4">
        Roket tidak ditemukan.
      </p>
    </v-container>

    <!-- Rocket Detail -->
    <template v-else>
      <v-row>
        <!-- Rocket Image -->
        <v-col
          cols="12"
          md="5"
        >
          <v-card rounded="lg">
            <v-img
              :src="rocketStore.selectedRocket.image_url ?? undefined"
              :alt="rocketStore.selectedRocket.full_name"
              cover
              max-height="500"
              class="bg-grey-darken-3"
            >
              <template #placeholder>
                <div
                  class="d-flex align-center justify-center fill-height"
                  style="min-height: 300px"
                >
                  <v-icon
                    color="grey"
                    icon="mdi-rocket-launch-outline"
                    size="96"
                  />
                </div>
              </template>
              <template #error>
                <div
                  class="d-flex align-center justify-center fill-height"
                  style="min-height: 300px"
                >
                  <v-icon
                    color="grey"
                    icon="mdi-image-off-outline"
                    size="96"
                  />
                </div>
              </template>
            </v-img>
          </v-card>
        </v-col>

        <!-- Rocket Info -->
        <v-col
          cols="12"
          md="7"
        >
          <h1 class="text-h4 font-weight-bold mb-4">
            {{ rocketStore.selectedRocket.full_name }}
          </h1>

          <p class="text-body-1 text-medium-emphasis mb-6">
            {{ rocketStore.selectedRocket.description ?? 'Tidak ada deskripsi tersedia.' }}
          </p>

          <v-divider class="mb-6" />

          <!-- Detail Fields -->
          <v-list
            bg-color="transparent"
            density="comfortable"
          >
            <v-list-item
              prepend-icon="mdi-currency-usd"
              :title="formatCost(rocketStore.selectedRocket.launch_cost)"
              subtitle="Biaya per Peluncuran"
            />

            <v-list-item
              prepend-icon="mdi-flag"
              :title="rocketStore.selectedRocket.manufacturer?.country_code ?? 'N/A'"
              subtitle="Negara"
            />

            <v-list-item
              prepend-icon="mdi-calendar"
              :title="formatDate(rocketStore.selectedRocket.maiden_flight)"
              subtitle="Penerbangan Pertama"
            />
          </v-list>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const rocketStore = useRocketStore()

function loadDetail() {
  const id = route.params.id as string
  rocketStore.loadRocketById(id)
}

onMounted(() => {
  loadDetail()
})

// Format cost string to USD currency format, or show N/A if missing.
function formatCost(cost: string | null): string {
  if (!cost) return 'N/A'
  const num = parseInt(cost, 10)
  if (isNaN(num)) return cost
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num)
}

// Format date string to a readable format, or show N/A if missing.
function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}
</script>

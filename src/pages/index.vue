<template>
  <v-container
    class="py-6"
    max-width="1200"
  >
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold d-flex align-center ga-2">
          <v-icon
            icon="mdi-rocket-launch"
            color="primary"
          />
          Roket SpaceX
        </h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          Daftar roket peluncur dan prototipe dari SpaceX
        </p>
      </div>

      <AddRocketDialog @add="handleAddRocket" />
    </div>

    <v-card
      class="mb-6 pa-4"
      elevation="1"
    >
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        label="Cari roket berdasarkan nama atau deskripsi..."
        variant="outlined"
        density="compact"
        hide-details
        clearable
      />
    </v-card>

    <div
      v-if="state.loading"
      class="text-center py-16"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="56"
        width="5"
      />
      <p class="text-body-1 text-medium-emphasis mt-4">
        Lagi memuat data roket...
      </p>
    </div>

    <v-alert
      v-else-if="state.error"
      type="error"
      variant="tonal"
      class="my-8"
      prominent
    >
      <div class="d-flex flex-wrap align-center justify-space-between ga-4">
        <div>
          <div class="text-subtitle-1 font-weight-bold">
            Gagal memuat data roket
          </div>
          <div class="text-body-2">
            {{ state.error }}
          </div>
        </div>
        <v-btn
          color="error"
          variant="elevated"
          prepend-icon="mdi-reload"
          @click="fetchRockets"
        >
          Coba Lagi
        </v-btn>
      </div>
    </v-alert>

    <div v-else>
      <div
        v-if="filteredRockets.length === 0"
        class="text-center py-16 text-medium-emphasis"
      >
        <v-icon
          icon="mdi-rocket-off"
          size="64"
        />
        <p class="text-h6 mt-3">
          Roket tidak ditemukan
        </p>
        <p class="text-body-2">
          Coba ubah kata kunci pencarian atau tambah roket baru di atas.
        </p>
      </div>

      <v-row v-else>
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketCard
            :rocket="rocket"
            @select="navigateToDetail"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rockets'
import RocketCard from '@/components/RocketCard.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import type { Rocket } from '@/types/rocket'

const router = useRouter()
const { state, allRockets, fetchRockets, addRocket } = useRocketStore()

const searchQuery = ref('')

const filteredRockets = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return allRockets.value

  return allRockets.value.filter(rocket => {
    const nameMatch = rocket.full_name?.toLowerCase().includes(query)
    const descMatch = rocket.description?.toLowerCase().includes(query)
    return nameMatch || descMatch
  })
})

const handleAddRocket = (newRocket: Rocket) => {
  addRocket(newRocket)
}

const navigateToDetail = (id: number | string) => {
  router.push(`/rockets/${id}`)
}

onMounted(() => {
  fetchRockets()
})
</script>

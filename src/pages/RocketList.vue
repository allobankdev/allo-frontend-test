<template>
  <v-container>
    <div class="d-flex flex-wrap align-center justify-space-between mb-4 ga-2">
      <h1 class="text-h5">
        Daftar Roket SpaceX
      </h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="isAddDialogOpen = true"
      >
        Tambah Roket
      </v-btn>
    </div>

    <RocketFilters
      v-model:search="store.searchQuery"
      v-model:family="store.familyFilter"
      :families="store.families"
      class="mb-4"
    />

    <AsyncState
      :loading="store.loading"
      :error="store.error"
      @retry="store.fetchRockets"
    >
      <v-alert
        v-if="store.filteredRockets.length === 0"
        type="info"
        variant="tonal"
      >
        Tidak ada roket yang cocok dengan pencarian/filter kamu.
      </v-alert>

      <v-row v-else>
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketCard
            :rocket="rocket"
            @click="goToDetail(rocket.id)"
          />
        </v-col>
      </v-row>
    </AsyncState>

    <AddRocketDialog
      v-model="isAddDialogOpen"
      @submit="store.addRocket"
    />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AsyncState from '@/components/common/AsyncState.vue'
import AddRocketDialog from '@/components/rockets/AddRocketDialog.vue'
import RocketCard from '@/components/rockets/RocketCard.vue'
import RocketFilters from '@/components/rockets/RocketFilters.vue'
import { useRocketStore } from '@/stores/rocket'
import type { Rocket } from '@/types/rocket'

const store = useRocketStore()
const router = useRouter()
const isAddDialogOpen = ref(false)

onMounted(() => {
  if (store.rockets.length === 0) {
    store.fetchRockets()
  }
})

function goToDetail(id: Rocket['id']) {
  router.push(`/rocket/${id}`)
}
</script>

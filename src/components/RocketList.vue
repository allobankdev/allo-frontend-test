<template>
  <div class="pa-4 fill-screen">
    <v-sheet
      class="pa-4 mb-6 d-flex align-center justify-space-between"
      rounded="lg"
      elevation="1"
    >
      <div class="text-h6 font-weight-bold">Rocket List</div>

      <div class="d-flex align-center gap-3">
        <v-btn color="primary" prepend-icon="mdi-plus">
          Add Rocket
        </v-btn>

        <v-btn variant="outlined" prepend-icon="mdi-filter">
          Filter
        </v-btn>
      </div>
    </v-sheet>

    <!-- Loading state -->
    <v-progress-linear
      v-if="rocketStore.loading"
      indeterminate
      color="primary"
      class="mb-4"
    />

    <!-- Rocket List -->
    <v-card
      v-for="rocket in rocketStore.filteredList"
      :key="rocket.id"
      class="pa-6 d-flex align-center mb-4"
      rounded="xl"
    >
      <div class="ml-6 flex-grow-1 text-left">
        <div class="text-h5 font-weight-bold">
          {{ rocket.name }}
        </div>

        <div class="text-body-1 mt-2">
          {{ rocket.description }}
        </div>

        <div class="text-caption mt-2">
          First Flight: {{ rocket.first_flight }}
        </div>
      </div>

      <div class="image-wrapper">
        <v-img
          :src="rocket.flickr_images?.[0]"
          width="180"
          height="120"
          cover
          class="rounded-lg"
        />

        <div
          class="image-overlay"
          @click="goToDetail(rocket.id)"
        >
          View Detail {{ rocket.name }}
        </div>
      </div>
    </v-card>

    <!-- Empty state -->
    <v-alert
      v-if="!rocketStore.loading && rocketStore.filteredList.length === 0"
      type="info"
      variant="tonal"
    >
      No rocket data found
    </v-alert>
  </div>
</template>


<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/utils/store/rocket.store'

const rocketStore = useRocketStore()
const router = useRouter()

onMounted(() => {
  rocketStore.fetchList()
})

const goToDetail = (id: string) => {
  router.push(`/rockets/${id}`)
}
</script>


<style scoped>
.fill-screen {
  min-height: 100vh;
}

/* spacing gap helper */
.gap-3 {
  gap: 12px;
}

.image-wrapper {
  position: relative;
  width: 180px;
  height: 120px;
  flex-shrink: 0;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  color: #ffffff;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  border-radius: 12px;
}

.image-wrapper:hover .image-overlay {
  opacity: 1;
  cursor: pointer;
}
</style>

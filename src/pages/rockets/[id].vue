<template>
  <div class="relative max-w-5xl mx-auto min-h-screen">
    <div class="absolute inset-0 bg-blue-500/20" />
    <div>
      <div v-if="rocketStore.loading" class="flex justify-center items-center h-screen">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else-if="rocketStore.error" class="flex flex-col items-center gap-4 py-10">
        <v-alert type="error" class="w-full">{{ rocketStore.error }}</v-alert>
        <v-btn color="primary" variant="tonal" prepend-icon="mdi-refresh" @click="handleRetry">
          Retry
        </v-btn>
      </div>
      <div v-else>
        <v-carousel v-if="rocketStore.selectedRocket?.flickr_images?.length">
          <v-carousel-item
            v-for="(image, index) in rocketStore.selectedRocket?.flickr_images"
            :key="`${rocketStore.selectedRocket?.id}-${index}`"
            :src="image"
          />
        </v-carousel>
        <v-alert v-else type="info">No rocket images available.</v-alert>
        <div class="flex flex-col gap-6 px-10 py-5">

      <div class="flex items-center gap-3">
        <h1 class="text-4xl font-bold">{{ rocketStore.selectedRocket?.name }}</h1>
        <span
          :class="rocketStore.selectedRocket?.active
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'"
          class="text-xs font-semibold px-3 py-1 rounded-full"
        >
          {{ rocketStore.selectedRocket?.active ? 'Active' : 'Retired' }}
        </span>
      </div>

      <p class="text-gray-300">
        {{ rocketStore.selectedRocket?.description }}
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div class="bg-white/5 border border-white/10 px-4 flex flex-col gap-1">
          <span class="text-xs text-gray-500 uppercase">Cost per Launch</span>
          <span class="text-xl font-bold text-white">
            ${{ rocketStore.selectedRocket?.cost_per_launch.toLocaleString() }}
          </span>
        </div>

        <div class="bg-white/5 border border-white/10 px-4 flex flex-col gap-1">
          <span class="text-xs text-gray-500 uppercase">Country</span>
          <span class="text-xl font-bold text-white">
            {{ rocketStore.selectedRocket?.country }}
          </span>
        </div>

        <div class="bg-white/5 border border-white/10 px-4 flex flex-col gap-1">
          <span class="text-xs text-gray-500 uppercase">First Flight</span>
          <span class="text-xl font-bold text-white">
            {{ rocketStore.selectedRocket?.first_flight }}
          </span>
        </div>

      </div>
    </div>
      </div>
    </div>
  </div>

  <v-dialog v-model="retrying" persistent width="auto">
    <v-card color="primary" width="320">
      <v-card-text class="flex flex-col items-center gap-4 py-6">
        Retrying, please wait...
        <v-progress-linear indeterminate color="white" class="mt-2" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useRocketStore } from '@/stores/store';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const id = route.params.id as string
const rocketStore = useRocketStore()
const retrying = ref(false)

const handleRetry = async () => {
  retrying.value = true
  try {
    await rocketStore.getRocketDetail(id)
  } finally {
    retrying.value = false
  }
}

onMounted(() => rocketStore.getRocketDetail(id))
</script>

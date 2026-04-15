<template>
  <div class="flex justify-center items-center" v-if="loading">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
  <div v-else-if="error" class="flex flex-col items-center gap-4 py-10">
    <v-alert type="error" class="w-full">{{ error }}</v-alert>
    <v-btn color="primary" variant="tonal" prepend-icon="mdi-refresh" @click="handleRetry">
      Retry
    </v-btn>
  </div>
  <div v-else>
    <div
      v-for="rocket in rockets"
      :key="rocket.id"
      class="mb-4 rounded-md bg-blue-500/20 p-6 last:mb-0"
    >
      <router-link :to="`/rockets/${rocket.id}`">
        <div class="flex gap-4">
          <img class="h-[200px] w-[200px] rounded object-cover" :src="rocket.flickr_images[0]" alt="rocket image">
          <div class="py-3 flex flex-col gap-2">
            <h1 class="text-2xl font-bold">{{ rocket.name }}</h1>
            <p class="text-gray-300">{{ rocket.description }}</p>
          </div>
        </div>
      </router-link>
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

<script setup lang="ts">
import type { Rocket } from '@/services/types'
import { ref } from 'vue'

const props = defineProps<{
  rockets: Rocket[]
  loading: boolean
  error: string | null
  onRetry?: () => Promise<void> | void
}>()

const retrying = ref(false)

const handleRetry = async () => {
  if (!props.onRetry) return
  retrying.value = true
  try {
    await props.onRetry()
  } finally {
    retrying.value = false
  }
}
</script>

<template>
  <v-container>
    <v-btn
      class="mb-4"
      variant="text"
      prepend-icon="mdi-arrow-left"
      @click="router.push('/')"
    >
      Kembali
    </v-btn>

    <AsyncState
      :loading="store.loading"
      :error="store.error"
      @retry="load"
    >
      <v-alert
        v-if="!rocket"
        type="warning"
        variant="tonal"
      >
        Roket tidak ditemukan.
      </v-alert>

      <v-card
        v-else
        class="mx-auto"
        max-width="800"
      >
        <RocketImage
          :src="rocket.image_url"
          height="360"
        />

        <v-card-title class="text-h5 mt-2">
          {{ rocket.full_name }}
        </v-card-title>

        <v-card-text>
          <p class="text-body-1 mb-4">
            {{ formatDescription(rocket.description) }}
          </p>
          <v-divider class="mb-2" />
          <RocketDetailFacts :rocket="rocket" />
        </v-card-text>
      </v-card>
    </AsyncState>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AsyncState from '@/components/common/AsyncState.vue'
import RocketImage from '@/components/rockets/RocketImage.vue'
import RocketDetailFacts from '@/components/rockets/RocketDetailFacts.vue'
import { useRocketStore } from '@/stores/rocket'
import type { Rocket } from '@/types/rocket'
import { formatDescription } from '@/utils/format'

const store = useRocketStore()
const route = useRoute()
const router = useRouter()

const rocket = ref<Rocket | null>(null)

async function load() {
  const id = route.params.id as string
  rocket.value = await store.fetchRocketDetail(id)
}

onMounted(load)

// If the user navigates from one rocket's detail straight to another's
// (same route component gets reused by vue-router), refetch for the new id.
watch(() => route.params.id, load)
</script>

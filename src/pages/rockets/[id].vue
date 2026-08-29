<template>
  <v-container class="py-6">
    <UiStateLoading
      v-if="loading"
      message="Loading rocket..."
    />
    <UiStateError
      v-else-if="error"
      :message="error"
      @retry="loadRocket()"
    />
    <template v-else-if="rocket">
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        class="mb-4"
        @click="router.back()"
      >
        Back to list
      </v-btn>
      <v-card
        variant="outlined"
        rounded="lg"
        class="overflow-hidden"
      >
        <v-img
          :src="imageUrl"
          :alt="rocket.name"
          height="320"
          cover
          gradient="to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%"
        >
          <v-card-title class="text-h4 font-weight-bold text-white fill-height d-flex align-end pb-4">
            {{ rocket.name }}
          </v-card-title>
        </v-img>
        <v-card-text class="pa-6">
          <p
            v-if="rocket.description"
            class="text-body-1 mb-6"
          >
            {{ rocket.description }}
          </p>
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <div class="text-caption text-medium-emphasis">
                Cost per launch
              </div>
              <div class="text-body-1 font-weight-medium">
                {{ costPerLaunch }}
              </div>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <div class="text-caption text-medium-emphasis">
                Country
              </div>
              <div class="text-body-1 font-weight-medium">
                {{ rocket.country || '—' }}
              </div>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <div class="text-caption text-medium-emphasis">
                First flight
              </div>
              <div class="text-body-1 font-weight-medium">
                {{ rocket.first_flight || '—' }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
    <v-alert
      v-else
      type="warning"
      class="mt-4"
    >
      Rocket not found.
    </v-alert>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketsStore } from '@/stores/rockets'
import { fetchRocketById } from '@/api/spacex'
import type { Rocket } from '@/types/rocket'
import UiStateLoading from '@/components/UiStateLoading.vue'
import UiStateError from '@/components/UiStateError.vue'

const route = useRoute()
const router = useRouter()
const store = useRocketsStore()

const rocket = ref<Rocket | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const id = computed(() => route.params.id as string)

const imageUrl = computed(() => {
  const r = rocket.value
  if (!r?.flickr_images?.length) return 'https://imgur.com/DaCfMsj.jpg'
  return r.flickr_images[0]
})

const costPerLaunch = computed(() => {
  const c = rocket.value?.cost_per_launch
  if (c == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(c)
})

async function loadRocket() {
  const rocketId = id.value
  if (!rocketId) return
  loading.value = true
  error.value = null
  try {
    let r: Rocket | null | undefined = store.getRocketById(rocketId)
    if (!r) {
      r = await fetchRocketById(rocketId)
    }
    rocket.value = r ?? null
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load rocket'
  } finally {
    loading.value = false
  }
}

onMounted(loadRocket)
watch(id, loadRocket)
</script>

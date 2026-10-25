<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore, type Rocket } from '@/stores/rocketStore'
import { formatCost, formatDate } from '@/utils/format'
import ErrorStatus from '@/components/ErrorStatus.vue'
import axios from 'axios'
import LoadingStatus from '@/components/LoadingStatus.vue'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const rocket = ref<Rocket | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchRocketDetail = async () => {
  loading.value = true
  error.value = null

  const rocketId = route.params.id as string

  const existingRocket = store.rockets.find((r) => String(r.id) === rocketId)

  if (existingRocket) {
    rocket.value = existingRocket
    loading.value = false
    return
  }

  try {
    const response = await axios.get(
      `https://lldev.thespacedevs.com/2.2.0/config/launcher/${rocketId}/`
    )
    rocket.value = response.data
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat detail roket.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRocketDetail()
})

</script>

<template>
  <v-container class="py-6">
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      class="mb-4"
      @click="router.push('/')"
    >
      Back
    </v-btn>

    <LoadingStatus
      v-if="loading"
      message="Loading rocket details..."
    />

    <ErrorStatus
      v-else-if="error"
      title="Failed to Load Rocket Details"
      :message="error"
      @retry="fetchRocketDetail"
    />

    <v-card v-else-if="rocket" class="overflow-hidden">
      <v-row no-gutters>
        <v-col cols="12" md="5">
          <v-img
            :src="rocket.image_url || 'https://via.placeholder.com/600x400?text=No+Image+Available'"
            height="100%"
            min-height="300"
            cover
            class="bg-grey-lighten-2"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular indeterminate color="grey-lighten-4" />
              </div>
            </template>
          </v-img>
        </v-col>

        <v-col cols="12" md="7" class="pa-6">
          <h1 class="text-h4 font-weight-bold mb-2">
            {{ rocket.full_name || 'Unnamed Rocket' }}
          </h1>

          <p class="text-body-1 text-grey-darken-1 mb-6">
            {{ rocket.description || 'No description available for this rocket.' }}
          </p>

          <v-divider class="mb-6" />

          <v-row>
            <v-col cols="12" sm="4">
              <div class="text-caption text-grey">Cost Per Launch</div>
              <div class="text-subtitle-1 font-weight-bold">
                {{ formatCost(rocket?.launch_cost) }}
              </div>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="text-caption text-grey">Country</div>
              <div class="text-subtitle-1 font-weight-bold">
                {{ rocket.manufacturer?.country_code || 'N/A' }}
              </div>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="text-caption text-grey">First Flight</div>
              <div class="text-subtitle-1 font-weight-bold">
                {{ formatDate(rocket?.maiden_flight) }}
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

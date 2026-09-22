<template>
  <v-app-bar
    flat
    color="transparent"
    class="px-2"
  >
    <v-btn
      icon="mdi-arrow-left"
      variant="text"
      @click="goBack"
    />
    <v-app-bar-title class="font-weight-bold">
      {{ rocket?.full_name || 'Rocket Details' }}
    </v-app-bar-title>
  </v-app-bar>

  <v-container
    fluid
    class="pa-4 pa-md-8"
  >
    <StateOverlay
      v-if="loading || error"
      :loading="loading"
      :error="error"
      loading-text="Loading rocket details..."
      @retry="loadRocket"
    />

    <v-container
      v-else-if="!rocket"
      class="fill-height"
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="6"
          class="text-center"
        >
          <v-icon
            icon="mdi-rocket-outline"
            size="64"
            color="grey-darken-1"
            class="mb-4"
          />
          <div class="text-h6 mb-2">
            Rocket not found
          </div>
          <v-btn
            color="primary"
            variant="elevated"
            rounded="lg"
            @click="goBack"
          >
            Back to list
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <template v-else>
      <v-row>
        <v-col
          cols="12"
          md="5"
        >
          <v-card
            rounded="xl"
            elevation="6"
            class="overflow-hidden"
          >
            <v-img
              :src="rocket.image_url || undefined"
              height="400"
              cover
            >
              <template #placeholder>
                <v-row
                  class="fill-height"
                  align="center"
                  justify="center"
                >
                  <v-icon
                    size="80"
                    color="grey-darken-1"
                    icon="mdi-rocket-launch-outline"
                  />
                </v-row>
              </template>
              <template #error>
                <v-row
                  class="fill-height"
                  align="center"
                  justify="center"
                  style="background: rgba(30,30,40,0.85)"
                >
                  <v-icon
                    size="80"
                    color="grey-darken-1"
                    icon="mdi-rocket-launch-outline"
                  />
                </v-row>
              </template>
            </v-img>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="7"
        >
          <h1 class="text-h4 font-weight-bold mb-2">
            {{ rocket.full_name }}
          </h1>

          <v-chip
            v-if="rocket.manufacturer?.name"
            color="primary"
            variant="tonal"
            size="small"
            class="mb-4"
            prepend-icon="mdi-domain"
          >
            {{ rocket.manufacturer.name }}
          </v-chip>

          <p
            class="text-body-1 text-medium-emphasis mb-6"
            style="line-height: 1.7"
          >
            {{ rocket.description || 'No description available.' }}
          </p>

          <v-divider class="mb-4" />

          <div class="d-flex flex-column ga-1">
            <RocketDetailInfo
              icon="mdi-currency-usd"
              label="Cost per Launch"
              :value="formattedCost"
              fallback="Not disclosed"
              icon-color="success"
            />
            <RocketDetailInfo
              icon="mdi-earth"
              label="Country"
              :value="rocket.manufacturer?.country_code"
              fallback="Unknown"
              icon-color="info"
            />
            <RocketDetailInfo
              icon="mdi-calendar-star"
              label="First Flight"
              :value="formattedDate"
              fallback="Unknown"
              icon-color="warning"
            />
          </div>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRockets } from '@/composables/useRockets'
import type { Rocket } from '@/types/rocket'

const route = useRoute()
const router = useRouter()
const { loading, error, fetchRockets, getRocketById, fetchRocketById } = useRockets()

const rocket = ref<Rocket | undefined>(undefined)

const formattedCost = computed(() => {
  if (!rocket.value?.launch_cost) return null
  const cost = rocket.value.launch_cost.replace(/,/g, '')
  const num = Number(cost)
  if (isNaN(num)) return `$${rocket.value.launch_cost}`
  return `$${num.toLocaleString()}`
})

const formattedDate = computed(() => {
  if (!rocket.value?.maiden_flight) return null
  try {
    const date = new Date(rocket.value.maiden_flight)
    if (isNaN(date.getTime())) return rocket.value.maiden_flight
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return rocket.value.maiden_flight
  }
})

async function loadRocket() {
  const id = Number(route.params.id)
  let found = getRocketById(id)
  if (!found) {
    await fetchRockets()
    found = getRocketById(id)
  }
  if (!found && id > 0) {
    found = await fetchRocketById(id)
  }
  rocket.value = found
}

function goBack() {
  router.push('/rockets')
}

onMounted(() => {
  loadRocket()
})
</script>

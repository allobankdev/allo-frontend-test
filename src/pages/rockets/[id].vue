<template>
  <v-container>
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      variant="text"
      @click="router.back()"
    >
      Back
    </v-btn>

    <AsyncState
      :error="error"
      :status="viewStatus"
      @retry="load"
    >
      <v-card v-if="rocket">
        <v-row no-gutters>
          <v-col
            cols="12"
            md="5"
          >
            <v-img
              v-if="rocket.image_url"
              class="bg-grey-darken-3 h-100"
              cover
              min-height="280"
              :src="rocket.image_url"
            >
              <template #error>
                <div class="d-flex align-center justify-center fill-height">
                  <v-icon
                    color="grey"
                    icon="mdi-rocket-launch-outline"
                    size="64"
                  />
                </div>
              </template>
            </v-img>

            <div
              v-else
              class="d-flex align-center justify-center bg-grey-darken-3"
              style="min-height: 280px"
            >
              <v-icon
                color="grey"
                icon="mdi-rocket-launch-outline"
                size="64"
              />
            </div>
          </v-col>

          <v-col
            cols="12"
            md="7"
          >
            <v-card-item>
              <v-card-title class="text-h5">
                {{ rocket.full_name || 'N/A' }}
              </v-card-title>
            </v-card-item>

            <v-card-text>
              <p class="mb-4 text-body-1">
                {{ rocket.description || 'N/A' }}
              </p>

              <v-list density="compact">
                <v-list-item
                  prepend-icon="mdi-currency-usd"
                  title="Cost per launch"
                  :subtitle="formatCost(rocket.launch_cost)"
                />
                <v-list-item
                  prepend-icon="mdi-earth"
                  title="Country"
                  :subtitle="rocket.manufacturer?.country_code || 'N/A'"
                />
                <v-list-item
                  prepend-icon="mdi-calendar"
                  title="First flight"
                  :subtitle="formatDate(rocket.maiden_flight)"
                />
              </v-list>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </AsyncState>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useRockets } from '@/composables/useRockets'
  import type { Rocket } from '@/types/rocket'

  const route = useRoute()
  const router = useRouter()
  const { findById, fetchRocket, status, error } = useRockets()

  const id = computed(() => String(route.params.id))
  const rocket = ref<Rocket | null>(findById(id.value))

  const viewStatus = computed(() =>
    rocket.value ? 'success' : status.value,
  )

  async function load () {
    const cached = findById(id.value)
    if (cached) {
      rocket.value = cached
      return
    }
    rocket.value = await fetchRocket(id.value)
  }

  function formatCost (cost: string | null): string {
    if (!cost) return 'N/A'

    const value = Number(cost)
    if (Number.isNaN(value)) return 'N/A'

    return new Intl.NumberFormat('en-US', {
      currency: 'USD',
      maximumFractionDigits: 0,
      style: 'currency',
    }).format(value)
  }

  function formatDate (date: string | null): string {
    if (!date) return 'N/A'

    const parsed = new Date(date)
    if (Number.isNaN(parsed.getTime())) return 'N/A'

    return parsed.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  onMounted(load)
  watch(id, load)
</script>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rockets'
import type { LoadStatus } from '@/stores/rockets'
import type { Rocket } from '@/types/rocket'
import { formatCost, formatCountry, formatFirstFlight } from '@/utils/format'

const route = useRoute('/rockets/[id]')
const store = useRocketStore()

const rocket = ref<Rocket | null>(null)
const status = ref<LoadStatus>('idle')
const errorMessage = ref('')

const rocketId = computed(() => route.params.id)

async function load(id: string): Promise<void> {
    if (!id) {
        status.value = 'error'
        errorMessage.value = 'Invalid rocket id.'
        return
    }

    status.value = 'loading'
    errorMessage.value = ''

    try {
        rocket.value = await store.getRocket(id)
        status.value = 'success'
    } catch (error) {
        rocket.value = null
        errorMessage.value =
            error instanceof Error ? error.message : 'Failed to load this rocket.'
        status.value = 'error'
    }
}

watch(
    rocketId,
    (id) => {
        void load(id)
    },
    { immediate: true },
)

const details = computed(() => {
    if (!rocket.value) return []
    return [
        { label: 'Cost per launch', value: formatCost(rocket.value.costPerLaunch), icon: 'mdi-cash' },
        { label: 'Country', value: formatCountry(rocket.value.country), icon: 'mdi-earth' },
        { label: 'First flight', value: formatFirstFlight(rocket.value.firstFlight), icon: 'mdi-calendar' },
    ]
})
</script>

<template>
  <v-container
    max-width="1000"
    class="py-8"
  >
    <v-btn
      to="/"
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
    >
      Back to rockets
    </v-btn>

    <StateWrapper
      :status="status"
      :error="errorMessage"
      :skeleton-count="1"
      @retry="load(rocketId)"
    >
      <article v-if="rocket">
        <v-card
          variant="flat"
          class="detail-card"
        >
          <RocketImage
            :src="rocket.imageUrl"
            :alt="rocket.name"
          />

          <v-card-item class="pt-5">
            <div class="d-flex flex-wrap align-center ga-3">
              <h1 class="text-h4 font-weight-bold">
                {{ rocket.name }}
              </h1>
              <v-chip
                size="small"
                :color="rocket.active ? 'success' : 'grey'"
                variant="tonal"
              >
                {{ rocket.active ? 'Active' : 'Retired' }}
              </v-chip>
              <v-chip
                v-if="rocket.isLocal"
                size="small"
                color="primary"
                variant="tonal"
              >
                Added by you
              </v-chip>
            </div>
          </v-card-item>

          <v-card-text>
            <p
              v-if="rocket.description"
              class="text-body-1 mb-6"
            >
              {{ rocket.description }}
            </p>
            <p
              v-else
              class="text-body-1 text-medium-emphasis font-italic mb-6"
            >
              No description available for this rocket.
            </p>

            <v-divider class="mb-4" />

            <v-row dense>
              <v-col
                v-for="item in details"
                :key="item.label"
                cols="12"
                sm="4"
              >
                <div class="detail-field">
                  <div class="d-flex align-center ga-2 text-caption text-medium-emphasis">
                    <v-icon
                      :icon="item.icon"
                      size="16"
                    />
                    <span>{{ item.label }}</span>
                  </div>
                  <div class="text-body-1 font-weight-medium mt-1">
                    {{ item.value }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </article>
    </StateWrapper>
  </v-container>
</template>

<style scoped>
.detail-card {
    overflow: hidden;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
    border-radius: 12px;
}

.detail-field {
    padding: 8px 0;
}
</style>
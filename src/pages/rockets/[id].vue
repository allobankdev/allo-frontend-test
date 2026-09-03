<template>
  <div class="detail-page">
    <AppNavbar>
      <template #actions>
        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          class="back-nav-btn"
          rounded="lg"
          @click="router.push('/')"
        >
          Back to Fleet
        </v-btn>
      </template>
    </AppNavbar>

    <main class="main-container">
      <v-container
        class="py-10"
        style="max-width: 980px;"
      >
        <div
          v-if="loading"
          class="d-flex flex-column align-center justify-center py-16"
        >
          <v-progress-circular
            indeterminate
            size="54"
            width="4"
            color="primary"
            class="mb-4"
          />
          <p class="text-body-2 text-medium-emphasis">
            Retrieving rocket specifications...
          </p>
        </div>

        <ErrorState
          v-else-if="errorMsg"
          :message="errorMsg"
          @retry="loadRocket"
        />

        <template v-else-if="rocket">
          <nav
            aria-label="Breadcrumb"
            class="mb-6"
          >
            <button
              class="back-link"
              @click="router.push('/')"
            >
              <v-icon
                icon="mdi-arrow-left"
                size="18"
                class="mr-1"
              />
              <span>Back to Fleet Overview</span>
            </button>
          </nav>

          <v-card
            class="detail-card"
            rounded="xl"
            elevation="0"
          >

            <RocketHeroImage
              :image-url="rocket.image_url"
              :alt-text="rocket.full_name"
              :is-custom="isCustom"
            />

            <div class="detail-body">
              <RocketDetailHeader
                :rocket-name="rocket.full_name || 'Unnamed Configuration'"
                :manufacturer-name="rocket.manufacturer?.name || 'SpaceX'"
                :country="formattedCountry"
                :maiden-flight="formattedDate"
                :launch-cost="formattedCost"
                :description="formattedDescription"
              />

              <RocketSpecsTable :rocket="rocket" />
            </div>
          </v-card>
        </template>
      </v-container>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRockets } from '@/composables/useRockets'
import type { Rocket } from '@/types/rocket'
import { formatCurrency, formatDate, formatCountry, formatText } from '@/utils/formatters'
import RocketHeroImage from '@/components/RocketHeroImage.vue'
import RocketDetailHeader from '@/components/RocketDetailHeader.vue'
import RocketSpecsTable from '@/components/RocketSpecsTable.vue'

const route = useRoute()
const router = useRouter()
const { fetchRocketById } = useRockets()

const rocket = ref<Rocket | null>(null)
const loading = ref(true)
const errorMsg = ref<string | null>(null)

const isCustom = computed(() => (rocket.value?.id ?? 0) < 0)

const formattedCountry = computed(() => {
  return formatCountry(rocket.value?.manufacturer?.country_code, 'Not specified')
})

const formattedDate = computed(() => {
  return formatDate(rocket.value?.maiden_flight, 'Not documented')
})

const formattedCost = computed(() => {
  return formatCurrency(rocket.value?.launch_cost, 'Not disclosed')
})

const formattedDescription = computed(() => {
  return formatText(
    rocket.value?.description,
    'No detailed technical description is currently documented for this vehicle configuration.',
  )
})

async function loadRocket() {
  const params = route.params as Record<string, string | undefined>
  const rawId = params.id
  const id = Number(rawId)

  if (isNaN(id)) {
    errorMsg.value = 'Invalid rocket identifier provided in the URL.'
    loading.value = false
    return
  }

  loading.value = true
  errorMsg.value = null

  try {
    const result = await fetchRocketById(id)
    if (result) {
      rocket.value = result
      document.title = `${result.full_name || 'Rocket Details'} - AstroFleet`
    } else {
      errorMsg.value = 'Failed to load rocket specifications. The vehicle may not exist or the data service is temporarily unavailable.'
    }
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'An error occurred while loading rocket specifications.'
  } finally {
    loading.value = false
  }
}

watch(
  () => (route.params as Record<string, string | undefined>).id,
  () => {
    loadRocket()
  },
)

onMounted(() => {
  loadRocket()
})
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background-color: #f8fafc;
  color: #0f172a;
}

.back-nav-btn {
  text-transform: none !important;
  font-weight: 600 !important;
  color: #334155 !important;
}

.back-link {
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  color: #0b2545;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.15s ease;
}

.back-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.detail-card {
  background: #ffffff !important;
  border: 1px solid #e2e8f0;
  border-radius: 20px !important;
  overflow: hidden;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05) !important;
}

.detail-body {
  padding: 32px 36px 44px 36px;
}

@media (max-width: 600px) {
  .detail-body {
    padding: 20px;
  }
}
</style>

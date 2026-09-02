<template>
  <v-container
    class="rocket-detail py-8"
    max-width="800"
  >
    <!-- Back navigation -->
    <v-btn
      to="/"
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4 pl-0"
    >
      Back to list
    </v-btn>

    <!-- State wrapper -->
    <AppStateWrapper
      :status="store.status"
      :error-message="store.errorMessage"
      @retry="loadDetail"
    >
      <div v-if="rocket">
        <!-- Hero image -->
        <v-img
          :src="rocket.image_url ?? undefined"
          height="360"
          cover
          rounded="lg"
          class="mb-6"
        >
          <template #placeholder>
            <div class="rocket-detail__image-placeholder">
              <v-icon
                icon="mdi-rocket"
                size="80"
                color="grey-lighten-1"
              />
            </div>
          </template>
        </v-img>

        <!-- Name -->
        <h1 class="text-h4 font-weight-bold mb-4">
          {{ rocket.full_name }}
        </h1>

        <!-- Description -->
        <p class="text-body-1 text-medium-emphasis mb-6">
          {{ rocket.description || 'No description available.' }}
        </p>

        <v-divider class="mb-6" />

        <!-- Detail grid -->
        <v-row>
          <v-col
            v-for="detail in detailItems"
            :key="detail.label"
            cols="12"
            sm="4"
          >
            <div class="rocket-detail__stat">
              <v-icon
                :icon="detail.icon"
                color="primary"
                size="20"
                class="mr-2"
              />
              <span class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                {{ detail.label }}
              </span>
              <p class="text-h6 font-weight-medium mt-1">
                {{ detail.value }}
              </p>
            </div>
          </v-col>
        </v-row>
      </div>
    </AppStateWrapper>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'

const route = useRoute()
const store = useRocketStore()

const rocketId = computed(() => Number(route.params.id))

const rocket = computed(() =>
  store.allRockets.find((r) => r.id === rocketId.value) ?? null
)

/** Detail rows shown below the description. */
const detailItems = computed(() => [
  {
    label: 'Cost per launch',
    icon: 'mdi-currency-usd',
    value: rocket.value?.launch_cost
      ? `\$${Number(rocket.value.launch_cost).toLocaleString()}`
      : '—',
  },
  {
    label: 'Country',
    icon: 'mdi-flag-outline',
    value: rocket.value?.manufacturer?.country_code ?? '—',
  },
  {
    label: 'First flight',
    icon: 'mdi-calendar-outline',
    value: rocket.value?.maiden_flight ?? '—',
  },
])

async function loadDetail(): Promise<void> {
  await store.ensureRocketLoaded(rocketId.value)
}

onMounted(loadDetail)
</script>

<style scoped>
.rocket-detail__image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgb(var(--v-theme-surface-variant));
}

.rocket-detail__stat {
  padding: 1rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  height: 100%;
}
</style>


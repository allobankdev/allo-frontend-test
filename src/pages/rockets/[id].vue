<template>
  <v-container
    class="py-6 px-4 px-md-8"
    fluid
  >
    <v-btn
      class="back-btn mb-4"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      Back to all rockets
    </v-btn>

    <!-- Loading state -->
    <v-row v-if="status === 'loading'">
      <v-col cols="12" md="5">
        <v-skeleton-loader
          class="rocket-detail__media-card"
          elevation="6"
          rounded="lg"
          type="image"
        />
      </v-col>
      <v-col cols="12" md="7">
        <v-skeleton-loader type="article, actions" />
      </v-col>
    </v-row>

    <!-- Fail / retry state -->
    <ErrorState
      v-else-if="status === 'error'"
      :message="errorMessage"
      show-back
      @back="router.push('/')"
      @retry="loadDetail"
    />

    <!-- Not-found state -->
    <EmptyState
      v-else-if="status === 'not-found'"
      action-label="Back to rocket list"
      message="It may have been removed, or the link is incorrect."
      title="Rocket not found"
      @action="router.push('/')"
    />

    <!-- Success state -->
    <v-row
      v-else-if="rocket"
      class="rocket-detail-enter"
    >
      <v-col cols="12" md="5">
        <v-card
          class="rocket-detail__media-card"
          elevation="6"
          rounded="lg"
        >
          <v-img
            v-if="rocket.imageUrl && !imageFailed"
            class="rocket-detail__image"
            cover
            height="420"
            :src="rocket.imageUrl"
            @error="imageFailed = true"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="primary" indeterminate />
              </div>
            </template>
            <div class="rocket-detail__image-scrim" />
          </v-img>
          <div
            v-else
            class="d-flex flex-column align-center justify-center rocket-detail__image-fallback"
            style="height: 420px;"
          >
            <v-icon color="disabled" icon="mdi-rocket-launch-outline" size="72" />
            <span class="text-body-2 text-medium-emphasis mt-2">No image available</span>
          </div>

          <v-chip
            v-if="rocket.isCustom"
            class="rocket-detail__media-badge"
            color="accent"
            prepend-icon="mdi-account-star"
            size="small"
            variant="flat"
          >
            Added by you
          </v-chip>
        </v-card>

        <!-- Manufacturer card -->
        <v-card
          v-if="rocket.manufacturer"
          class="mt-4"
          elevation="4"
          rounded="lg"
        >
          <v-card-item>
            <div class="d-flex align-center ga-3">
              <!-- <v-avatar
                v-if="rocket.manufacturer.logoUrl"
                :image="rocket.manufacturer.logoUrl"
                size="40"
                rounded="0"
              /> -->
              <div>
                <div class="text-subtitle-1 font-weight-bold">
                  {{ rocket.manufacturer.name }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ rocket.manufacturer.type }} · {{ formatCountry(rocket.manufacturer.countryCode) }}
                </div>
              </div>
            </div>
          </v-card-item>

          <v-card-text v-if="rocket.manufacturer.description" class="text-body-2 text-medium-emphasis">
            {{ formatText(rocket.manufacturer.description) }}
          </v-card-text>

          <v-card-text class="pt-0">
            <div class="d-flex flex-wrap ga-4">
              <div v-if="rocket.manufacturer.foundingYear" class="mini-stat">
                <span class="mini-stat__label">Founded</span>
                <span class="mini-stat__value">{{ rocket.manufacturer.foundingYear }}</span>
              </div>
              <div v-if="rocket.manufacturer.administrator" class="mini-stat">
                <span class="mini-stat__label">Leadership</span>
                <span class="mini-stat__value">{{ rocket.manufacturer.administrator }}</span>
              </div>
              <div v-if="rocket.manufacturer.totalLaunchCount" class="mini-stat">
                <span class="mini-stat__label">Total launches</span>
                <span class="mini-stat__value">{{ rocket.manufacturer.totalLaunchCount }}</span>
              </div>
            </div>
          </v-card-text>

          <v-card-actions v-if="rocket.manufacturer.infoUrl || rocket.manufacturer.wikiUrl">
            <v-btn
              v-if="rocket.manufacturer.infoUrl"
              :href="rocket.manufacturer.infoUrl"
              target="_blank"
              rel="noopener"
              size="small"
              variant="text"
              prepend-icon="mdi-web"
            >
              Website
            </v-btn>
            <v-btn
              v-if="rocket.manufacturer.wikiUrl"
              :href="rocket.manufacturer.wikiUrl"
              target="_blank"
              rel="noopener"
              size="small"
              variant="text"
              prepend-icon="mdi-wikipedia"
            >
              Wikipedia
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="7">
        <div class="d-flex flex-wrap align-center ga-2 mb-2">
          <h1 class="rocket-detail__title text-h4 font-weight-bold">
            {{ rocket.fullName }}
          </h1>
        </div>

        <div class="d-flex flex-wrap ga-2 mb-5">
          <v-chip v-if="rocket.family" prepend-icon="mdi-rocket-outline" size="small" variant="outlined">
            {{ rocket.family }}
          </v-chip>
          <v-chip v-if="rocket.variant" size="small" variant="outlined">
            Variant {{ rocket.variant }}
          </v-chip>
          <v-chip v-if="rocket.alias" size="small" variant="outlined">
            "{{ rocket.alias }}"
          </v-chip>
          <v-chip v-if="rocket.active" color="success" prepend-icon="mdi-check-circle-outline" size="small" variant="tonal">
            Active
          </v-chip>
          <v-chip v-else color="grey" prepend-icon="mdi-close-circle-outline" size="small" variant="tonal">
            Retired
          </v-chip>
          <v-chip v-if="rocket.reusable" color="info" prepend-icon="mdi-recycle" size="small" variant="tonal">
            Reusable
          </v-chip>
        </div>

        <p class="rocket-detail__description text-body-1">
          {{ formatText(rocket.description) }}
        </p>

        <!-- Overview stats -->
        <v-row class="mt-4">
          <v-col cols="12" sm="4">
            <div class="stat-card">
              <div class="stat-card__icon">
                <v-icon icon="mdi-currency-usd" size="20" />
              </div>
              <div>
                <div class="stat-card__label">Cost per launch</div>
                <div class="stat-card__value">{{ formatCurrency(rocket.launchCost) }}</div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="stat-card">
              <div class="stat-card__icon">
                <v-icon icon="mdi-map-marker-outline" size="20" />
              </div>
              <div>
                <div class="stat-card__label">Country</div>
                <div class="stat-card__value">{{ formatCountry(rocket.manufacturer?.countryCode) }}</div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="stat-card">
              <div class="stat-card__icon">
                <v-icon icon="mdi-calendar-star" size="20" />
              </div>
              <div>
                <div class="stat-card__label">First flight</div>
                <div class="stat-card__value">{{ formatDate(rocket.maidenFlight) }}</div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Specifications -->
        <div class="section-title mt-6 mb-3">Specifications</div>
        <v-row>
          <v-col cols="6" sm="3">
            <div class="mini-stat-block">
              <span class="mini-stat-block__label">Height</span>
              <span class="mini-stat-block__value">{{ formatNumber(rocket.length, 'm') }}</span>
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="mini-stat-block">
              <span class="mini-stat-block__label">Diameter</span>
              <span class="mini-stat-block__value">{{ formatNumber(rocket.diameter, 'm') }}</span>
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="mini-stat-block">
              <span class="mini-stat-block__label">Launch mass</span>
              <span class="mini-stat-block__value">{{ formatNumber(rocket.launchMass, 't') }}</span>
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="mini-stat-block">
              <span class="mini-stat-block__label">Stages</span>
              <span class="mini-stat-block__value">{{ formatStages(rocket.minStage, rocket.maxStage) }}</span>
            </div>
          </v-col>
        </v-row>

        <!-- Performance -->
        <div class="section-title mt-6 mb-3">Performance</div>
        <v-row>
          <v-col cols="6" sm="3">
            <div class="mini-stat-block">
              <span class="mini-stat-block__label">LEO capacity</span>
              <span class="mini-stat-block__value">{{ formatNumber(rocket.leoCapacity, 'kg') }}</span>
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="mini-stat-block">
              <span class="mini-stat-block__label">GTO capacity</span>
              <span class="mini-stat-block__value">{{ formatNumber(rocket.gtoCapacity, 'kg') }}</span>
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="mini-stat-block">
              <span class="mini-stat-block__label">Takeoff thrust</span>
              <span class="mini-stat-block__value">{{ formatNumber(rocket.toThrust, 'kN') }}</span>
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="mini-stat-block">
              <span class="mini-stat-block__label">Apogee</span>
              <span class="mini-stat-block__value">{{ formatNumber(rocket.apogee, 'km') }}</span>
            </div>
          </v-col>
        </v-row>

        <!-- Launch & landing record -->
        <div class="section-title mt-6 mb-3">Launch record</div>
        <v-row>
          <v-col cols="6" sm="3">
            <div class="mini-stat-block">
              <span class="mini-stat-block__label">Total launches</span>
              <span class="mini-stat-block__value">{{ rocket.totalLaunchCount ?? '—' }}</span>
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="mini-stat-block mini-stat-block--success">
              <span class="mini-stat-block__label">Successful</span>
              <span class="mini-stat-block__value">{{ rocket.successfulLaunches ?? '—' }}</span>
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="mini-stat-block mini-stat-block--danger">
              <span class="mini-stat-block__label">Failed</span>
              <span class="mini-stat-block__value">{{ rocket.failedLaunches ?? '—' }}</span>
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="mini-stat-block">
              <span class="mini-stat-block__label">Pending</span>
              <span class="mini-stat-block__value">{{ rocket.pendingLaunches ?? '—' }}</span>
            </div>
          </v-col>
        </v-row>

        <template v-if="hasLandingData">
          <div class="section-title mt-6 mb-3">Landing record</div>
          <v-row>
            <v-col cols="6" sm="3">
              <div class="mini-stat-block">
                <span class="mini-stat-block__label">Attempted</span>
                <span class="mini-stat-block__value">{{ rocket.attemptedLandings ?? '—' }}</span>
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="mini-stat-block mini-stat-block--success">
                <span class="mini-stat-block__label">Successful</span>
                <span class="mini-stat-block__value">{{ rocket.successfulLandings ?? '—' }}</span>
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="mini-stat-block mini-stat-block--danger">
                <span class="mini-stat-block__label">Failed</span>
                <span class="mini-stat-block__value">{{ rocket.failedLandings ?? '—' }}</span>
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="mini-stat-block">
                <span class="mini-stat-block__label">Consecutive success</span>
                <span class="mini-stat-block__value">{{ rocket.consecutiveSuccessfulLandings ?? '—' }}</span>
              </div>
            </v-col>
          </v-row>
        </template>

        <!-- Links -->
        <div class="d-flex flex-wrap ga-2 mt-6">
          <v-btn
            v-if="rocket.wikiUrl"
            :href="rocket.wikiUrl"
            target="_blank"
            rel="noopener"
            variant="tonal"
            prepend-icon="mdi-wikipedia"
            size="small"
          >
            Wikipedia
          </v-btn>
          <v-btn
            v-if="rocket.infoUrl"
            :href="rocket.infoUrl"
            target="_blank"
            rel="noopener"
            variant="tonal"
            prepend-icon="mdi-information-outline"
            size="small"
          >
            More info
          </v-btn>
        </div>

        <div
          v-if="rocket.manufacturer?.name"
          class="manufacturer-pill mt-5"
        >
          <v-icon icon="mdi-factory" size="16" />
          Manufactured by {{ rocket.manufacturer.name }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import EmptyState from '@/components/common/EmptyState.vue'
  import ErrorState from '@/components/common/ErrorState.vue'
  import { useDocumentTitle } from '@/composables/useDocumentTitle'
  import { RocketApiError } from '@/services/rocketApi'
  import { useRocketStore } from '@/stores/rockets'
  import { formatCountry } from '@/utils/countries'
  import { formatCurrency, formatDate, formatText } from '@/utils/format'
  import type { Rocket } from '@/types/rocket'

  const route = useRoute('/rockets/[id]')
  const router = useRouter()
  const store = useRocketStore()

  const rocketId = computed(() => String(route.params.id))

  type DetailStatus = 'loading' | 'success' | 'error' | 'not-found'

  const status = ref<DetailStatus>('loading')
  const errorMessage = ref('')
  const rocket = ref<Rocket | null>(null)
  const imageFailed = ref(false)

  useDocumentTitle(() => rocket.value?.fullName)

  const hasLandingData = computed(() =>
    !!rocket.value && (rocket.value.attemptedLandings ?? 0) > 0
  )

  function formatNumber (value: number | null | undefined, unit: string) {
    if (value === null || value === undefined) return '—'
    return `${value.toLocaleString()} ${unit}`
  }

  function formatStages (min?: number | null, max?: number | null) {
    if (!min && !max) return '—'
    if (min === max) return String(min)
    return `${min ?? '—'}–${max ?? '—'}`
  }

  async function loadDetail () {
  status.value = 'loading'
  errorMessage.value = ''
  imageFailed.value = false
  rocket.value = null

  try {
    const fetched = await store.loadRocketById(rocketId.value)
    console.log('RAW FETCHED ROCKET:', JSON.stringify(fetched, null, 2))   // <-- tambahkan ini

    if (fetched) {
      rocket.value = fetched
      status.value = 'success'
    } else {
      status.value = 'not-found'
    }
  } catch (error) {
    status.value = 'error'
    errorMessage.value = error instanceof RocketApiError
      ? error.message
      : 'Failed to load this rocket. Please try again.'
  }
}

  onMounted(loadDetail)

  watch(
    () => route.params.id,
    () => loadDetail()
  )
</script>

<style scoped>
.back-btn {
  transition: transform 0.2s ease;
}

.back-btn:hover {
  transform: translateX(-4px);
}

@keyframes rocket-detail-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.rocket-detail-enter {
  animation: rocket-detail-enter 0.45s ease both;
}

.rocket-detail__media-card {
  position: relative;
  overflow: hidden;
}

.rocket-detail__image :deep(.v-img__img) {
  transition: transform 0.6s ease;
}

.rocket-detail__media-card:hover .rocket-detail__image :deep(.v-img__img) {
  transform: scale(1.06);
}

.rocket-detail__image-scrim {
  position: absolute;
  inset: auto 0 0 0;
  height: 40%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.45), transparent);
  pointer-events: none;
}

.rocket-detail__image-fallback {
  background: rgba(128, 128, 128, 0.08);
}

.rocket-detail__media-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

.rocket-detail__title {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-on-surface)),
    rgba(var(--v-theme-primary), 0.85)
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.rocket-detail__description {
  color: rgba(var(--v-theme-on-surface), 0.78);
  line-height: 1.65;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(var(--v-theme-on-surface), 0.04);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -12px rgba(var(--v-theme-primary), 0.45);
  border-color: rgba(var(--v-theme-primary), 0.35);
}

.stat-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: rgb(var(--v-theme-primary));
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.16),
    rgba(var(--v-theme-accent), 0.16)
  );
}

.stat-card__label {
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.stat-card__value {
  font-size: 15px;
  font-weight: 600;
}

.manufacturer-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  color: rgba(var(--v-theme-on-surface), 0.7);
  background: rgba(var(--v-theme-on-surface), 0.04);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.mini-stat-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(var(--v-theme-on-surface), 0.03);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.mini-stat-block--success {
  border-color: rgba(var(--v-theme-success), 0.3);
  background: rgba(var(--v-theme-success), 0.06);
}

.mini-stat-block--danger {
  border-color: rgba(var(--v-theme-error), 0.3);
  background: rgba(var(--v-theme-error), 0.06);
}

.mini-stat-block__label {
  font-size: 11px;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.mini-stat-block__value {
  font-size: 15px;
  font-weight: 600;
}

.mini-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mini-stat__label {
  font-size: 11px;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.mini-stat__value {
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 600px) {
  .back-btn {
    display: none;
  }
}
</style>

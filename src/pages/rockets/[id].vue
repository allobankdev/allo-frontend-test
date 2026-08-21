<template>
  <div class="rocket-detail-page">
    <AppNavigationBar
      :title="rocket?.full_name ?? ''"
      :show-back="true"
      back-label="Rockets"
      max-width="720px"
      @back="goBack"
    />

    <div v-if="status === 'loading'" class="hig-detail-content">
      <v-skeleton-loader type="image" height="320" rounded="lg" class="mb-4 hig-image-border" />
      <v-skeleton-loader type="heading" class="mb-3" />
      <v-skeleton-loader type="paragraph" class="mb-6" />
      <v-skeleton-loader type="list-item-three-line" />
      <v-skeleton-loader type="list-item-three-line" />
      <v-skeleton-loader type="list-item-three-line" />
    </div>

    <ErrorState
      v-else-if="status === 'error'"
      :message="errorMsg"
      @retry="load()"
    />

    <div v-else-if="rocket" class="hig-detail-content">
      <div class="hig-hero mb-6">
        <v-img
          v-if="rocket.image_url"
          :src="rocket.image_url"
          height="320"
          cover
          rounded="lg"
          class="hig-hero-img"
          :alt="rocket.full_name"
        >
          <template #placeholder>
            <v-skeleton-loader type="image" height="320" />
          </template>
          <template #error>
            <div class="hig-hero-fallback" aria-hidden="true">
              <v-icon size="80" color="tertiary-label">mdi-rocket-launch-outline</v-icon>
            </div>
          </template>
        </v-img>
        <div v-else class="hig-hero-fallback" aria-hidden="true">
          <v-icon size="80" color="tertiary-label">mdi-rocket-launch-outline</v-icon>
        </div>
      </div>

      <h1 class="hig-title1 mb-2">{{ rocket.full_name }}</h1>

      <p class="hig-body hig-secondary-label mb-6" style="letter-spacing: -0.43px;">
        {{ rocket.description ?? 'No description available for this rocket.' }}
      </p>

      <div class="hig-info-list" role="list">
        <div class="hig-info-row" role="listitem">
          <v-icon size="20" color="primary" class="hig-info-icon" aria-hidden="true">
            mdi-currency-usd
          </v-icon>
          <div class="hig-info-content">
            <span class="hig-subhead-label">Cost per launch</span>
            <span v-if="rocket.launch_cost" class="hig-body">
              ${{ Number(rocket.launch_cost).toLocaleString() }}
            </span>
            <v-chip v-else size="small" color="warning" variant="tonal">
              Unavailable
            </v-chip>
          </div>
        </div>

        <div class="hig-separator-inset" role="separator" />

        <div class="hig-info-row" role="listitem">
          <v-icon size="20" color="primary" class="hig-info-icon" aria-hidden="true">
            mdi-factory
          </v-icon>
          <div class="hig-info-content">
            <span class="hig-subhead-label">Manufacturer</span>
            <span class="hig-body">{{ rocket.manufacturer?.name ?? 'SpaceX' }}</span>
          </div>
        </div>

        <div class="hig-separator-inset" role="separator" />

        <div class="hig-info-row" role="listitem">
          <v-icon size="20" color="primary" class="hig-info-icon" aria-hidden="true">
            mdi-flag-outline
          </v-icon>
          <div class="hig-info-content">
            <span class="hig-subhead-label">Country</span>
            <span class="hig-body">{{ rocket.manufacturer?.country_code ?? 'USA' }}</span>
          </div>
        </div>

        <div class="hig-separator-inset" role="separator" />

        <div class="hig-info-row" role="listitem">
          <v-icon size="20" color="primary" class="hig-info-icon" aria-hidden="true">
            mdi-calendar-star-outline
          </v-icon>
          <div class="hig-info-content">
            <span class="hig-subhead-label">First flight</span>
            <span
              class="hig-body"
              :style="!rocket.maiden_flight ? `color: var(--hig-tertiary-label)` : ''"
            >
              {{ rocket.maiden_flight ?? 'Unknown' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppNavigationBar from '@/components/common/AppNavigationBar.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import { useRocketDetail } from '@/composables/useRocketDetail'

const route = useRoute()
const router = useRouter()

const id = Number(route.params.id)
const { rocket, status, errorMsg, load } = useRocketDetail(id)

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'home' })
  }
}

watch(
  () => route.params.id,
  () => {
    load()
  }
)

onMounted(() => load())
</script>

<style scoped>
.rocket-detail-page {
  min-height: 100vh;
  background: var(--hig-bg-primary);
  font-family: var(--hig-font-stack);
}

.hig-detail-content {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--hig-space-md) var(--hig-space-md) var(--hig-space-3xl);
}

@media (min-width: 600px) {
  .hig-detail-content {
    padding-left: var(--hig-space-lg);
    padding-right: var(--hig-space-lg);
    padding-top: var(--hig-space-lg);
  }
}

@media (min-width: 960px) {
  .hig-detail-content {
    padding-left: var(--hig-space-xl);
    padding-right: var(--hig-space-xl);
    padding-top: var(--hig-space-xl);
  }
}

.hig-hero {
  width: 100%;
  border-radius: var(--hig-radius-lg);
  overflow: hidden;
  border: 0.5px solid var(--hig-separator);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.hig-hero-img {
  width: 100%;
  height: 320px;
}

.hig-hero-fallback {
  height: 320px;
  background: linear-gradient(to bottom, var(--hig-bg-secondary), var(--hig-bg-tertiary));
  display: flex;
  align-items: center;
  justify-content: center;
}

.hig-image-border {
  border: 0.5px solid var(--hig-separator);
}

.hig-info-list {
  background: var(--hig-bg-secondary);
  border-radius: var(--hig-radius-lg);
  border: 0.5px solid var(--hig-separator);
  overflow: hidden;
}

.hig-info-row {
  display: flex;
  align-items: center;
  gap: var(--hig-space-md);
  padding: var(--hig-space-md);
  min-height: var(--hig-tap-target);
}

.hig-separator-inset {
  height: 0.5px;
  background: var(--hig-separator);
  margin-left: calc(20px + var(--hig-space-md) * 2);
}

.hig-info-icon {
  flex-shrink: 0;
}

.hig-info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.hig-subhead-label {
  font-size: var(--hig-subhead-size);
  font-weight: var(--hig-subhead-weight);
  color: var(--hig-secondary-label);
  font-family: var(--hig-font-stack);
}
</style>

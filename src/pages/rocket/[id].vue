<template>
  <v-container class="py-6">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
      @click="$router.back()"
    >
      Back
    </v-btn>

    <AppLoader v-if="store.status === 'loading'" />

    <AppErrorRetry
      v-else-if="store.status === 'error'"
      :message="store.errorMessage"
      @retry="loadRocket"
    />

    <v-alert
      v-else-if="!rocket"
      type="warning"
      variant="tonal"
    >
      Rocket not found.
    </v-alert>

    <template v-else>
      <v-card
        rounded="lg"
        variant="outlined"
        class="detail-card"
      >
        <div class="hero-wrapper">
          <AppImage
            v-if="rocket.image_url"
            :src="rocket.image_url"
            :alt="rocket.full_name"
            :height="360"
          />
          <div
            v-else
            class="hero-placeholder"
            :style="{ height: '300px' }"
          >
            <v-icon
              size="72"
              color="primary"
            >
              mdi-rocket-launch-outline
            </v-icon>
          </div>
          <div class="hero-overlay">
            <div class="d-flex align-center ga-3">
              <span class="text-h4 font-weight-bold text-white">{{ rocket.full_name }}</span>
              <v-chip
                v-if="rocket.isLocal"
                size="small"
                color="success"
                variant="flat"
              >
                LOKAL
              </v-chip>
            </div>
          </div>
        </div>

        <v-card-item>
          <template #subtitle>
            <p class="text-body-1 text-medium-emphasis mt-2">
              {{ fallbackText(rocket.description, 'No description available') }}
            </p>
          </template>
        </v-card-item>

        <v-card-text>
          <RocketDetailInfo :rocket="rocket" />
        </v-card-text>
      </v-card>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import { fallbackText } from '@/utils/formatters'
import AppLoader from '@/components/common/AppLoader.vue'
import AppErrorRetry from '@/components/common/AppErrorRetry.vue'
import AppImage from '@/components/common/AppImage.vue'
import RocketDetailInfo from '@/components/rocket/RocketDetail.vue'

const route = useRoute()
const store = useRocketStore()

const rocketId = computed(() => String(route.params.id ?? ''))
const rocket = computed(() => store.getRocketById(rocketId.value))

function loadRocket() {
  if (store.apiRockets.length === 0) {
    store.fetchRockets()
  }
}

watch(rocketId, loadRocket, { immediate: true })
</script>

<style scoped>
.detail-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.hero-wrapper {
  position: relative;
}

.hero-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    160deg,
    rgba(var(--v-theme-primary), 0.3) 0%,
    rgb(var(--v-theme-surface)) 60%
  );
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px 24px 20px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.75) 0%, transparent 100%);
}
</style>

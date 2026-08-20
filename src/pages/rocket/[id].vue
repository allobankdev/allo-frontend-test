<template>
  <div class="rocket-detail">
    <v-btn
      class="back-btn"
      @click="goBack"
    >
      <v-icon>mdi-arrow-left</v-icon>
      Back to List
    </v-btn>

    <div
      v-if="rocketStore.loading"
      class="loading-container"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      />
      <p class="loading-text">
        Loading rocket details...
      </p>
    </div>

    <div
      v-else-if="rocketStore.error"
      class="error-container"
    >
      <v-alert
        type="error"
        :text="rocketStore.error"
        class="error-alert"
      >
        <template #append>
          <v-btn @click="rocketStore.retry">
            Retry
          </v-btn>
        </template>
      </v-alert>
    </div>

    <div
      v-else-if="rocketStore.selectedRocket"
      class="detail-content"
    >
      <RocketDetailHeader :rocket="rocketStore.selectedRocket" />
      <RocketDetailInfo :rocket="rocketStore.selectedRocket" />
      <RocketGallery :images="rocketStore.selectedRocket.flickr_images" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import RocketDetailHeader from '@/components/RocketDetail/RocketDetailHeader.vue'
import RocketDetailInfo from '@/components/RocketDetail/RocketDetailInfo.vue'
import RocketGallery from '@/components/RocketDetail/RocketGallery.vue'

const router = useRouter()
const route = useRoute()
const rocketStore = useRocketStore()

const rocketId = route.params.id as string

onMounted(() => {
  if (rocketId) {
    rocketStore.loadRocketDetail(rocketId)
  }
})

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.rocket-detail {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.back-btn {
  margin-bottom: 24px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  gap: 16px;
}

.loading-text {
  font-size: 16px;
  color: #666;
}

.error-container {
  padding: 24px;
}

.error-alert {
  margin-bottom: 0;
}

.detail-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .rocket-detail {
    padding: 16px;
  }
}
</style>

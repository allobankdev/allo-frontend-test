<template>
  <div class="rocket-detail-page">
    <v-container
      class="py-6"
      style="max-width: 1100px"
    >
      <div
        v-if="store.detailLoading"
        class="py-8"
      >
        <v-skeleton-loader
          type="card-avatar, article, table-heading, actions"
          min-height="400"
          class="rounded-xl"
        />
      </div>

      <ErrorAlert
        v-else-if="store.detailError"
        title="Could not load rocket details"
        :message="store.detailError"
        :loading="store.detailLoading"
        @retry="loadRocket"
      >
        <template #extra-actions>
          <v-btn
            variant="tonal"
            to="/"
            prepend-icon="mdi-arrow-left"
          >
            Back to Fleet
          </v-btn>
        </template>
      </ErrorAlert>

      <RocketDetailView
        v-else-if="store.selectedRocket"
        :rocket="store.selectedRocket"
      />

      <EmptyState
        v-else
        title="Rocket Not Found"
        message="The requested launcher configuration could not be located."
        :show-reset="false"
      >
        <v-btn
          color="primary"
          to="/"
          prepend-icon="mdi-arrow-left"
          class="mt-3"
        >
          Return to Fleet
        </v-btn>
      </EmptyState>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rockets'

const route = useRoute()
const store = useRocketStore()

const loadRocket = () => {
  const rocketId = (route.params as Record<string, unknown>).id as string | undefined
  if (rocketId) {
    store.fetchRocketDetail(rocketId)
  }
}

onMounted(() => {
  loadRocket()
})

watch(
  () => (route.params as Record<string, unknown>).id as string | undefined,
  (newId) => {
    if (newId) {
      loadRocket()
    }
  }
)
</script>

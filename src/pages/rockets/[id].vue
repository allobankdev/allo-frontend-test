<template>
  <v-container
    class="py-6 py-md-10"
    max-width="1100"
  >
    <v-btn
      class="mb-6 ms-n3"
      prepend-icon="mdi-arrow-left"
      :to="{ name: '/' }"
      variant="text"
    >
      All rockets
    </v-btn>

    <LoadingState
      v-if="status === 'loading' || status === 'idle'"
      message="Loading rocket…"
    />

    <ErrorState
      v-else-if="status === 'error'"
      :icon="notFound ? 'mdi-rocket-outline' : 'mdi-cloud-off-outline'"
      :message="error ?? 'Failed to load rocket.'"
      :retryable="!notFound"
      :title="notFound ? 'Rocket not found' : 'Couldn\'t load rocket'"
      @retry="retry"
    >
      <template #actions>
        <v-btn
          size="large"
          :to="{ name: '/' }"
          variant="tonal"
        >
          Back to list
        </v-btn>
      </template>
    </ErrorState>

    <v-row v-else-if="rocket">
      <v-col
        cols="12"
        md="6"
      >
        <v-card
          border
          class="overflow-hidden"
        >
          <RocketImage
            :alt="rocket.name"
            :aspect-ratio="4 / 3"
            :src="rocket.imageUrl"
          />
        </v-card>
      </v-col>

      <v-col
        class="ps-md-8"
        cols="12"
        md="6"
      >
        <div class="d-flex flex-wrap ga-2 mb-3">
          <v-chip
            color="primary"
            prepend-icon="mdi-rocket-launch-outline"
            size="small"
            variant="tonal"
          >
            {{ rocket.isLocal ? 'Added by you' : 'SpaceX' }}
          </v-chip>
        </div>

        <h1 class="text-h4 text-md-h3 font-weight-bold">
          {{ rocket.name }}
        </h1>

        <p
          class="text-body-1 text-medium-emphasis mt-4 description"
          :class="{ 'font-italic': !rocket.description }"
        >
          {{ rocket.description ?? 'No description available.' }}
        </p>

        <RocketSpecGrid
          class="mt-6"
          :specs="specs"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onBeforeUnmount } from 'vue'
  import { useRoute } from 'vue-router'
  import ErrorState from '@/components/ErrorState.vue'
  import LoadingState from '@/components/LoadingState.vue'
  import RocketImage from '@/components/RocketImage.vue'
  import RocketSpecGrid from '@/components/RocketSpecGrid.vue'
  import { useRocketDetail } from '@/composables/useRocketDetail'
  import { formatCurrency, formatDate } from '@/utils/format'
  import type { RocketSpec } from '@/types/rocket'

  const route = useRoute('/rockets/[id]')

  const { rocket, status, error, notFound, retry, cancel } = useRocketDetail(() => route.params.id)

  const specs = computed<RocketSpec[]>(() => [
    { label: 'Cost per launch', icon: 'mdi-cash-multiple', value: formatCurrency(rocket.value?.costPerLaunch ?? null) },
    { label: 'Country', icon: 'mdi-flag-outline', value: rocket.value?.country ?? null },
    { label: 'First flight', icon: 'mdi-calendar-outline', value: formatDate(rocket.value?.firstFlight ?? null) },
  ])

  onBeforeUnmount(cancel)
</script>

<style scoped>
.description {
  line-height: 1.7;
}
</style>

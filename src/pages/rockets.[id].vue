<template>
  <v-container class="py-6 py-md-8">
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      variant="text"
      @click="goBack"
    >
      Back to rockets
    </v-btn>

    <StateLoading
      v-if="isLoading"
      message="Loading rocket…"
    />

    <StateError
      v-else-if="isError"
      :message="errorMessage"
      title="Couldn't load this rocket"
      @retry="refetch"
    />

    <StateEmpty
      v-else-if="!rocket"
      message="This rocket may have been removed, or the link is incorrect."
      title="Rocket not found"
    >
      <v-btn
        class="mt-4"
        color="primary"
        :to="{ name: '/' }"
        variant="flat"
      >
        Back to rockets
      </v-btn>
    </StateEmpty>

    <template v-else>
      <v-row>
        <v-col
          cols="12"
          md="5"
        >
          <v-card>
            <RocketImage
              :alt="rocket.name"
              :height="320"
              :icon-size="72"
              :src="rocket.imageUrl"
            />
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="7"
        >
          <div class="d-flex align-center ga-3 flex-wrap">
            <h1 class="text-h5 text-md-h4 font-weight-bold">
              {{ rocket.name }}
            </h1>
            <v-chip
              v-if="rocket.isLocal"
              color="primary"
              density="comfortable"
              size="small"
              variant="tonal"
            >
              Added by you
            </v-chip>
          </div>

          <p class="text-body-1 text-medium-emphasis mt-3">
            {{ description }}
          </p>

          <v-divider class="my-5" />

          <v-row dense>
            <v-col
              cols="12"
              sm="4"
            >
              <DetailField
                icon="mdi-cash"
                label="Cost per launch"
                :value="formatCurrency(rocket.launchCost)"
              />
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <DetailField
                icon="mdi-earth"
                label="Country"
                :value="formatText(rocket.country)"
              />
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <DetailField
                icon="mdi-calendar-start"
                label="First flight"
                :value="formatDate(rocket.firstFlight)"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { toErrorMessage, useRocketQuery } from '@/queries/rockets'
  import { formatCurrency, formatDate, formatText, NOT_AVAILABLE } from '@/utils/format'

  const route = useRoute('/rockets.[id]')
  const router = useRouter()

  const rocketId = computed(() => String(route.params.id ?? ''))

  const { rocket, isLoading, isError, error, refetch } = useRocketQuery(rocketId)

  const errorMessage = computed(() => toErrorMessage(error.value))

  const description = computed(() => {
    const text = formatText(rocket.value?.description ?? null)
    return text === NOT_AVAILABLE ? 'No description available for this rocket.' : text
  })

  /** Keeps in-app history intact, but still works on a direct visit. */
  function goBack () {
    if (window.history.state?.back) {
      router.back()
    } else {
      router.push({ name: '/' })
    }
  }
</script>

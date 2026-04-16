<script setup lang='ts'>
import { useRocketStore } from '@/stores/rocket';
import { formatCurrency } from '@/utils/formatter';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDate } from 'vuetify';

const date = useDate()
const route = useRoute()
const rocketId = computed(() => route.params.id as string)

const rocketStore = useRocketStore()
const { state, rocket } = storeToRefs(rocketStore)

onMounted(() => {
  rocketStore.getRocketById(rocketId.value)
})
</script>

<template>
  <v-container>
    <v-card
      v-if="state.details === 'loading'"
    >
      <v-skeleton-loader
        type="article, chip, chip, chip, divider, image, image, image"
      />
    </v-card>
    <v-card v-else-if="state.details === 'success'">
      <v-card-title class="d-flex justify-space-between">
        <div>{{ rocket?.name }}</div>
        <v-btn
          variant="tonal"
          prepend-icon="mdi-arrow-left"
          @click="$router.back"
        >
          Back
        </v-btn>
      </v-card-title>
      <v-card-text class="d-flex flex-column ga-3">
        <div>{{ rocket?.description }}</div>
        <div class="d-flex ga-1 flex-wrap">
          <v-chip
            size="small"
            prepend-icon="mdi-flag-variant"
          >
            {{ rocket?.country }}
          </v-chip>
          <v-chip size="small">
            {{ formatCurrency(rocket?.cost_per_launch) }}/launch
          </v-chip>
          <v-chip
            size="small"
            prepend-icon="mdi-rocket-launch"
          >
            {{ date.format(rocket?.first_flight, "fullDateWithWeekday") }}
          </v-chip>
        </div>
        <v-row dense>
          <v-col
            v-for="image in rocket?.flickr_images ?? []"
            :key="image"
            cols="12"
            md="6"
            xl="3"
          >
            <v-img
              :src="image"
              aspect-ratio="1"
              cover
              class="rounded"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card
      v-else
    >
      <v-empty-state
        icon="mdi-rocket"
        title="Failed To Load"
        text="Something went wrong on our end and we couldn't load the rocket. Please try again in a moment."
        class="mx-auto my-16"
      >
        <template #actions>
          <v-btn @click="$router.push('/')">
            Go Home
          </v-btn>
          <v-btn @click="$router.back">
            Go Back
          </v-btn>
          <v-btn @click="rocketStore.getRocketById(rocketId)">
            Retry Request
          </v-btn>
        </template>
      </v-empty-state>
    </v-card>
  </v-container>
</template>
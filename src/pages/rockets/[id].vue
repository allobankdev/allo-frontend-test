<template>
  <v-container>
    <!-- Loading -->
    <div v-if="store.loading" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate size="64" color="primary" />
    </div>

    <!-- Error -->
    <v-alert v-else-if="store.error" type="error" class="mb-4">
      {{ store.error }}
      <template #append>
        <v-btn variant="outlined" size="small" @click="fetchRocket">
          Retry
        </v-btn>
      </template>
    </v-alert>

    <!-- Detail -->
    <template v-else-if="rocket">
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        class="mb-4"
        @click="router.push('/rockets')"
      >
        Back to Rockets
      </v-btn>

      <v-row>
        <v-col cols="12" md="6">
          <v-img
            :src="rocket.flickr_images[0]"
            height="400"
            cover
            rounded="lg"
            class="bg-grey-darken-3"
          >
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey" />
              </v-row>
            </template>
          </v-img>
        </v-col>

        <v-col cols="12" md="6">
          <h1 class="text-h3 font-weight-bold mb-2">{{ rocket.name }}</h1>

          <v-chip
            :color="rocket.active ? 'success' : 'error'"
            size="small"
            class="mb-4"
          >
            {{ rocket.active ? 'Active' : 'Inactive' }}
          </v-chip>

          <p class="text-body-1 mb-6">{{ rocket.description }}</p>

          <v-list density="compact" class="bg-transparent">
            <v-list-item prepend-icon="mdi-currency-usd">
              <v-list-item-title>Cost per Launch</v-list-item-title>
              <v-list-item-subtitle>
                ${{ rocket.cost_per_launch.toLocaleString() }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item prepend-icon="mdi-earth">
              <v-list-item-title>Country</v-list-item-title>
              <v-list-item-subtitle>{{ rocket.country }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item prepend-icon="mdi-calendar">
              <v-list-item-title>First Flight</v-list-item-title>
              <v-list-item-subtitle>{{ rocket.first_flight }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item prepend-icon="mdi-arrow-expand-vertical">
              <v-list-item-title>Height</v-list-item-title>
              <v-list-item-subtitle>{{ rocket.height.meters }}m / {{ rocket.height.feet }}ft</v-list-item-subtitle>
            </v-list-item>
            <v-list-item prepend-icon="mdi-diameter-variant">
              <v-list-item-title>Diameter</v-list-item-title>
              <v-list-item-subtitle>{{ rocket.diameter.meters }}m / {{ rocket.diameter.feet }}ft</v-list-item-subtitle>
            </v-list-item>
            <v-list-item prepend-icon="mdi-weight-kilogram">
              <v-list-item-title>Mass</v-list-item-title>
              <v-list-item-subtitle>{{ rocket.mass.kg.toLocaleString() }} kg</v-list-item-subtitle>
            </v-list-item>
            <v-list-item prepend-icon="mdi-rocket-launch">
              <v-list-item-title>Stages</v-list-item-title>
              <v-list-item-subtitle>{{ rocket.stages }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-btn
            v-if="rocket.wikipedia"
            :href="rocket.wikipedia"
            target="_blank"
            variant="outlined"
            prepend-icon="mdi-wikipedia"
            class="mt-4"
          >
            Wikipedia
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const rocket = computed(() => store.selectedRocket)

function fetchRocket() {
  store.fetchRocketById(route.params.id as string)
}

onMounted(() => {
  fetchRocket()
})
</script>

<!-- Rocket detail screen: image, name, description, cost, country, first flight. -->
<template>
  <v-container class="py-8">
    <v-btn
      class="mb-6"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      Back to rockets
    </v-btn>

    <StateView
      error-text="Couldn't load this rocket."
      loading-text="Fetching rocket…"
      :status="status"
      @retry="load"
    >
      <template v-if="rocket">
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-img
              :alt="rocket.name"
              class="rounded-lg bg-surface-light"
              cover
              height="360"
              :src="rocket.flickr_images[0] ?? ''"
            >
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-icon
                    icon="mdi-rocket-launch-outline"
                    size="64"
                  />
                </div>
              </template>
            </v-img>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <h1 class="text-h4 mb-2">
              {{ rocket.name }}
            </h1>
            <v-chip
              class="mb-4"
              :color="rocket.active ? 'success' : 'grey'"
              size="small"
            >
              {{ rocket.active ? 'Active' : 'Inactive' }}
            </v-chip>
            <p class="text-body-1 mb-6">
              {{ rocket.description }}
            </p>

            <v-list
              class="bg-transparent"
              density="comfortable"
            >
              <v-list-item prepend-icon="mdi-cash">
                <v-list-item-title>Cost per launch</v-list-item-title>
                <v-list-item-subtitle>{{ cost }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="mdi-earth">
                <v-list-item-title>Country</v-list-item-title>
                <v-list-item-subtitle>{{ rocket.country }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="mdi-calendar">
                <v-list-item-title>First flight</v-list-item-title>
                <v-list-item-subtitle>{{ rocket.first_flight }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </template>
    </StateView>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import StateView from '@/components/StateView.vue'
  import { useRocketsStore } from '@/stores/rockets'
  import type { RequestStatus } from '@/stores/rockets'
  import type { Rocket } from '@/types/rocket'

  const route = useRoute()
  const store = useRocketsStore()

  const rocket = ref<Rocket | null>(null)
  const status = ref<RequestStatus>('idle')

  const cost = computed(() =>
    rocket.value
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(rocket.value.cost_per_launch)
      : '',
  )

  async function load () {
    status.value = 'loading'
    try {
      store.loadCustomRockets()
      const result = await store.getRocketById(String(route.params.id))
      if (!result) throw new Error('Rocket not found')
      rocket.value = result
      status.value = 'success'
    } catch {
      status.value = 'error'
    }
  }

  onMounted(load)
</script>

<template>
  <v-container
    class="py-8"
    max-width="1100"
  >
    <v-btn
      class="mb-6"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      All rockets
    </v-btn>
    <LoadState
      v-if="store.loading"
      :loading="true"
    />
    <LoadState
      v-else-if="store.error"
      :error="store.error"
      :loading="false"
      @retry="store.fetchRockets(true)"
    />
    <v-empty-state
      v-else-if="!rocket"
      icon="mdi-rocket-outline"
      title="Rocket not found"
      text="Open details from rocket list. Local rockets remain available during this app session."
    >
      <template #actions>
        <v-btn
          color="primary"
          to="/"
        >
          Back to list
        </v-btn>
      </template>
    </v-empty-state>
    <v-card
      v-else
      overflow="hidden"
    >
      <v-row no-gutters>
        <v-col
          cols="12"
          md="6"
        >
          <v-img
            v-if="rocket.image_url"
            :alt="name"
            cover
            height="100%"
            min-height="400"
            :src="rocket.image_url"
          /><div
            v-else
            class="placeholder d-flex align-center justify-center"
          >
            <v-icon
              icon="mdi-rocket-launch"
              size="100"
            />
          </div>
        </v-col><v-col
          cols="12"
          md="6"
        >
          <v-card-text class="pa-8">
            <v-chip
              v-if="rocket.local"
              class="mb-4"
              color="primary"
            >
              Added locally
            </v-chip><h1 class="text-h3 font-weight-bold mb-5">
              {{ name }}
            </h1><p class="text-body-1 mb-8">
              {{ rocket.description || 'Description unavailable.' }}
            </p><v-list bg-color="transparent">
              <v-list-item
                v-for="item in details"
                :key="item.label"
                :prepend-icon="item.icon"
                :subtitle="item.value"
                :title="item.label"
              />
            </v-list>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue'; import { useRoute } from 'vue-router'; import LoadState from '@/components/LoadState.vue'; import { useRocketStore } from '@/stores/rockets'
const route = useRoute(); const store = useRocketStore(); const rocket = computed(() => store.byId(String(route.params.id))); const name = computed(() => rocket.value?.full_name || 'Unnamed rocket')
const formatCost = (value: string | null | undefined) => { const cost = Number(value); return value && Number.isFinite(cost) && cost >= 0 ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cost) : 'Unavailable' }
const formatDate = (value: string | null | undefined) => { if (!value) return 'Unavailable'; const date = new Date(value); return Number.isNaN(date.getTime()) ? 'Unavailable' : new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(date) }
const details = computed(() => [{ label: 'Launch cost', icon: 'mdi-cash', value: formatCost(rocket.value?.launch_cost) }, { label: 'Country', icon: 'mdi-earth', value: rocket.value?.manufacturer?.country_code || 'Unavailable' }, { label: 'First flight', icon: 'mdi-calendar', value: formatDate(rocket.value?.maiden_flight) }])
onMounted(() => store.fetchRockets())
</script>
<style scoped>.placeholder { min-height: 400px; background: #20252b; color: #8b949e; }</style>

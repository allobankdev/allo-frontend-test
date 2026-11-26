<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import AsyncState from "@/components/AsyncState.vue";
import RocketImage from "@/components/RocketImage.vue";
import { useRocketStore } from "@/stores/rockets";
import { formatCost, formatDate, NOT_AVAILABLE } from "@/utils/format";

const route = useRoute();
const store = useRocketStore();

const rocketId = computed(() => String(route.params.id));
const rocket = computed(() => store.findRocket(rocketId.value));

const loadRocket = () => store.getRocketById(rocketId.value);

watch(rocketId, loadRocket, { immediate: true });
</script>

<template>
  <v-container class="py-8" max-width="960">
    <v-btn to="/" prepend-icon="mdi-arrow-left" variant="text" class="mb-5">
      All rockets
    </v-btn>

    <AsyncState
      :loading="store.loading"
      :error="store.error"
      error-title="Could not load rocket"
      @retry="loadRocket"
    >
      <v-alert v-if="!rocket" type="warning" title="Rocket not found">
        This rocket may no longer be available.
      </v-alert>

      <v-card v-else>
        <RocketImage :src="rocket.image_url" height="340" :icon-size="84" />
        <v-card-title class="text-h4 text-wrap pt-6 px-6">
          {{ rocket.full_name }}
        </v-card-title>
        <v-card-text class="px-6 text-body-1">
          {{ rocket.description || "No description available." }}
        </v-card-text>
        <v-divider />
        <v-list lines="two">
          <v-list-item
            title="Cost per launch"
            :subtitle="formatCost(rocket.launch_cost)"
          />
          <v-list-item
            title="Country"
            :subtitle="rocket.manufacturer?.country_code || NOT_AVAILABLE"
          />
          <v-list-item
            title="First flight"
            :subtitle="formatDate(rocket.maiden_flight)"
          />
        </v-list>
      </v-card>
    </AsyncState>
  </v-container>
</template>

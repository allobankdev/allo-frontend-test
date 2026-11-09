<template>
  <v-container>
    <ui-state
      v-if="!rocket"
      type="error"
      message="Rocket not found."
      retryable
      @retry="$router.push('/')"
    />
    <v-card v-else>
      <v-card-actions>
        <v-btn
          text
          @click="$router.push('/')"
        >
          <v-icon start>
            mdi-arrow-left
          </v-icon>
          Back
        </v-btn>
      </v-card-actions>
      <v-img
        :src="rocket.flickr_images[0]"
        max-height="400"
        contain
      />
      <v-card-title>{{ rocket.name }}</v-card-title>
      <v-card-text>
        <p>{{ rocket.description }}</p>
        <v-list dense>
          <v-list-item>Cost per Launch: ${{ rocket.cost_per_launch.toLocaleString() }}</v-list-item>
          <v-list-item>Country: {{ rocket.country }}</v-list-item>
          <v-list-item>First Flight: {{ rocket.first_flight }}</v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRocketStore } from '@/store/rocket';
import type { IDataRocket } from '@/types/rocket';
import UiState from '@/components/UIState.vue';

const route = useRoute();
const store = useRocketStore();
const rocket = ref<IDataRocket | null>(null);

onMounted(async() => {
  const id = route.params.id as string;

  if (store.rockets.length === 0) {
    await store.loadRockets();
  }

  rocket.value = store.rockets.find(r => r.id === id) || null;
});
</script>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useRocketStore } from "@/stores/rocket";
import { computed, onMounted, ref } from "vue";
import type { Rocket } from "@/services/rocket.service";

const route = useRoute();
const store = useRocketStore();

const rocket = ref<Rocket>();

const rocketId = computed(() => String(route.params.id ?? ""));

const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  loading.value = true;
  error.value = null;

  try {
    if (!store.rockets.length) {
      await store.fetchRockets();
    }
    rocket.value = store.getRocketById(rocketId.value);
    if (!rocket.value) {
      error.value = "Rocket not found.";
    }
  } catch {
    error.value = "Failed to load rocket detail.";
  } finally {
    loading.value = false;
  }
});

</script>

<template>
  <div v-if="rocket">
    <v-img
      :src="rocket.flickr_images[0]"
      height="300px"
      cover
    />
    <div class="flex flex-col gap-y-2 h-full">
      <h1 class="text-2xl font-bold mt-4">
        {{ rocket.name }}
      </h1>
      <span>{{ rocket.description }}</span>
      <span><strong>Cost per Launch:</strong> ${{ rocket.cost_per_launch }}</span>
      <span><strong>Country:</strong> {{ rocket.country }}</span>
      <span><strong>First Flight:</strong> {{ rocket.first_flight }}</span>
    </div>
  </div>
  <div v-else>
    <p>Rocket not found.</p>
  </div>

  <div class="w-full mt-5 flex">
    <v-btn
      variant="outlined"
      text="Go back"
      elevation="4"
      @click="$router.back()"
    />
  </div>
</template>

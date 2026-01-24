<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { useRocketStore } from "@/stores/rocket.store";
import { useLocalRocketCrudStore } from "@/stores/locale-rocket-crud.store";
import type { DisplayRocket, Rocket } from "@/schema/rocket.schema";

const route = useRoute();
const store = useRocketStore();
const storeRocketLocale = useLocalRocketCrudStore();


async function fetchRocket() {
  const currentParamId = route.params.id;
  if (typeof currentParamId === "string") {
    await store.getRocket(currentParamId);
    storeRocketLocale.getById(currentParamId);
  }
}

const currentRocket = computed(() => {
  if (store.rocket) {
    return {
      ...store.rocket,
      sourceType: "API",
    } as DisplayRocket;
  }

  if (storeRocketLocale.currentRocket) {
    return {
      ...storeRocketLocale.currentRocket,
      sourceType: "LOCALE",
    } as DisplayRocket;
  }

  return undefined;
});

const errorMessage = computed(()=> {
  if(storeRocketLocale.currentRocket){
    return null
  }
  return store.error
})

onMounted(fetchRocket);
</script>

<template>
  <!-- Loading -->
  <div v-if="store.loading" class="flex justify-center py-24">
    <v-progress-circular indeterminate color="primary" size="48" />
  </div>

  <!-- Error -->
  <div
    v-else-if="errorMessage"
    class="mx-auto max-w-md rounded-xl bg-white p-6 text-center shadow"
  >
    <p class="mb-4 text-red-600 font-semibold">Failed to load rocket data</p>
    <v-btn color="primary" @click="fetchRocket">Retry</v-btn>
  </div>

  <!-- Not found -->
  <div v-else-if="!currentRocket" class="text-center py-20 text-gray-500">
    Rocket not found
  </div>

  <!-- Content -->
  <div v-else class="mx-auto max-w-6xl px-4 py-10 space-y-8">
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ currentRocket.name }}
        </h1>

        <v-chip
          v-if="currentRocket.active"
          color="success"
          size="small"
          class="ml-2"
        >
          Active
        </v-chip>
      </div>

      <p class="max-w-3xl text-gray-600 leading-relaxed">
        {{ currentRocket.description }}
      </p>
    </div>

    <!-- Main Card -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Image -->
      <div class="lg:col-span-2">
        <v-card rounded="xl" elevation="2" class="overflow-hidden">
          <v-img :src="currentRocket.flickr_images?.[0]" height="360" cover />
        </v-card>
      </div>

      <!-- Info Panel -->
      <div class="lg:col-span-2">
        <v-card rounded="xl" elevation="2">
          <div class="p-6 space-y-6">
            <div class="space-y-1">
              <p class="text-sm text-gray-500">First flight</p>
              <p class="font-medium">
                {{ currentRocket.first_flight }}
              </p>
            </div>

            <div class="space-y-1">
              <p class="text-sm text-gray-500">Country</p>
              <v-chip size="small" variant="tonal" color="primary">
                {{ currentRocket.country }}
              </v-chip>
            </div>

            <div class="space-y-1">
              <p class="text-sm text-gray-500">Company</p>
              <p class="font-medium">
                {{ currentRocket.company }}
              </p>
            </div>

            <v-divider />

            <div class="space-y-3">
              <h3 class="font-semibold text-gray-900">Technical Specs</h3>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-500">Stages</p>
                  <p class="font-medium">{{ currentRocket.stages }}</p>
                </div>

                <div>
                  <p class="text-gray-500">Boosters</p>
                  <p class="font-medium">{{ currentRocket.boosters }}</p>
                </div>

                <div v-if="currentRocket.cost_per_launch">
                  <p class="text-gray-500">Cost / Launch</p>
                  <p class="font-medium">
                    ${{ currentRocket.cost_per_launch.toLocaleString() }}
                  </p>
                </div>

                <div>
                  <p class="text-gray-500">Success Rate</p>
                  <p class="font-medium">
                    {{ currentRocket.success_rate_pct }}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3">
      <v-btn variant="outlined" @click="$router.back()"> Back </v-btn>

      <v-btn
        v-if="currentRocket.sourceType === 'API'"
        color="primary"
        :href="currentRocket.wikipedia"
        target="_blank"
      >
        Wikipedia
      </v-btn>
    </div>
  </div>
</template>

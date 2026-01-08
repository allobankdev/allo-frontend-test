<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRocketStore } from "@/stores/rocketStore";
import type { Rocket } from "@/types/rocketTypes";

const route = useRoute();
const rocketStore = useRocketStore();
const rocket = ref<Rocket | null>(null);

onMounted(async () => {
  const rocketId = route.params.id as string | undefined;
  if (!rocketId) {
    console.error("No rocket ID provided in route");
    return;
  }

  try {
    rocketStore.loading = true;
    const response = await rocketStore.fetchRocketById(rocketId);
    if (response) rocket.value = response;
  } catch (error) {
    console.error("Error fetching rocket details:", error);
  } finally {
    rocketStore.loading = false;
  }
});

function handleRetry() {
  const rocketId = route.params.id as string;
  if (rocketId) {
    rocketStore.fetchRocketById(rocketId);
  }
}
</script>

<template>
  <div class="rocket-detail-page">
    <div v-if="rocketStore.loading && !rocket" class="loading-state">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4">Loading rocket details...</p>
    </div>

    <div v-else-if="rocketStore.error" class="error-state">
      <ErrorRetry :error="rocketStore.error" :on-retry="handleRetry" />
    </div>

    <div v-else-if="rocket">
      <RocketDetailView :rocket="rocket" />
    </div>

    <div v-else class="not-found-state">
      <v-alert type="warning" class="not-found-alert">
        <template #title>
          <v-icon icon="mdi-alert" class="warning-icon" />
          Rocket Not Found
        </template>

        <p>The requested rocket could not be found.</p>

        <template #append>
          <v-btn color="primary" class="back-button" @click="$router.push('/')">
            <v-icon left icon="mdi-arrow-left" />
            Back to List
          </v-btn>
        </template>
      </v-alert>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rocket-detail-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.loading-state,
.error-state,
.not-found-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
}

.not-found-alert {
  max-width: 600px;
  margin: 2rem auto;

  .warning-icon {
    margin-right: 0.5rem;
  }

  .back-button {
    margin-left: 1rem;
  }
}
</style>

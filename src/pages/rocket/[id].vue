<template>
  <v-container class="py-8">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      @click="router.back()"
    >
      Back
    </v-btn>

    <LoadingState v-if="loading" />
    <ErrorState
      v-else-if="error"
      :message="error"
      @retry="loadRocket"
    />

    <v-row v-else-if="rocket">
      <v-col
        cols="12"
        md="5"
      >
        <v-img
          :src="rocket.image_url ?? undefined"
          height="320"
          cover
          class="bg-grey-lighten-2 rounded-lg"
        >
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-icon
                icon="mdi-rocket-launch-outline"
                size="64"
                color="grey"
              />
            </div>
          </template>
          <template #error>
            <div class="d-flex align-center justify-center fill-height">
              <v-icon
                icon="mdi-image-off-outline"
                size="64"
                color="grey"
              />
            </div>
          </template>
        </v-img>
      </v-col>

      <v-col
        cols="12"
        md="7"
      >
        <h1
          class="display mb-2"
          style="font-size: clamp(24px, 3vw, 34px); text-transform: uppercase"
        >
          {{ rocket.full_name || "Unknown vehicle" }}
        </h1>
        <p
          class="text-body-1 mb-6"
          style="color: var(--text-dim)"
        >
          {{
            rocket.description || "No mission data available for this vehicle."
          }}
        </p>

        <div class="stat-panel">
          <div class="stat-row">
            <span class="mono label">COST/LAUNCH</span>
            <span class="mono value">{{
              formatCurrency(rocket.launch_cost)
            }}</span>
          </div>
          <div class="stat-row">
            <span class="mono label">ORIGIN</span>
            <span class="mono value">{{
              rocket.manufacturer?.country_code || "UNKNOWN"
            }}</span>
          </div>
          <div class="stat-row">
            <span class="mono label">MAIDEN FLIGHT</span>
            <span class="mono value">{{
              rocket.maiden_flight || "UNKNOWN"
            }}</span>
          </div>
        </div>
      </v-col>
    </v-row>

    <ErrorState
      v-else
      message="Rocket not found."
      @retry="loadRocket"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRockets } from "@/composables/useRockets";
import type { Rocket } from "@/types/rocket";
import LoadingState from "@/components/LoadingState.vue";
import ErrorState from "@/components/ErrorState.vue";
import { formatCurrency } from "@/utils/format";

const route = useRoute();
const router = useRouter();
const { getRocketById, fetchRocketById } = useRockets();

const rocket = ref<Rocket | undefined>(undefined);
const loading = ref(false);
const error = ref<string | null>(null);

async function loadRocket() {
  const id = String((route.params as { id: string }).id);
  error.value = null;

  const cached = getRocketById(id);
  if (cached) {
    rocket.value = cached;
    return;
  }

  if (id.startsWith("local-")) {
    rocket.value = undefined;
    return;
  }

  loading.value = true;
  try {
    rocket.value = await fetchRocketById(id);
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Failed to load rocket detail";
  } finally {
    loading.value = false;
  }
}

onMounted(loadRocket);
</script>

<style scoped>
.stat-panel {
  border: 1px solid var(--line);
  background: var(--bg-panel);
  border-radius: 4px;
}
.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
}
.stat-row:last-child {
  border-bottom: none;
}
.label {
  color: var(--text-dim);
  letter-spacing: 0.08em;
}
.value {
  color: var(--amber);
  font-weight: 500;
}
</style>

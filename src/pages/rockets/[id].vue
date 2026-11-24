<template>
  <v-container
    class="py-8"
    style="max-width: 1100px"
  >
    <v-btn
      to="/"
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
    >
      Kembali
    </v-btn>
    <RequestState
      :loading="store.detailLoading[id]"
      :error="store.detailErrors[id]"
      :retryable="/^[1-9]\d*$/.test(id)"
      loading-label="Memuat detail rocket…"
      @retry="store.retryDetail(id)"
    />

    <v-card v-if="rocket">
      <v-row no-gutters>
        <v-col
          cols="12"
          md="5"
        >
          <RocketImage
            :src="rocket.imageUrl"
            :name="name"
            :height="360"
          />
        </v-col>
        <v-col
          cols="12"
          md="7"
          class="pa-6"
        >
          <h1 class="text-h4 mb-3 rocket-text">
            {{ name }}
          </h1>
          <v-chip
            v-if="rocket.source === 'local'"
            class="mb-4"
            size="small"
          >
            Rocket lokal
          </v-chip>
          <p class="mb-6 description rocket-text">
            {{ displayText(rocket.description, "Deskripsi belum tersedia.") }}
          </p>
          <dl>
            <dt class="text-medium-emphasis">
              Biaya per peluncuran
            </dt>
            <dd class="mb-4">
              {{ formatLaunchCost(rocket.launchCost) }}
            </dd>
            <dt class="text-medium-emphasis">
              Negara
            </dt>
            <dd class="mb-4 rocket-text">
              {{ displayText(rocket.country) }}
            </dd>
            <dt class="text-medium-emphasis">
              Penerbangan pertama
            </dt>
            <dd>{{ formatFirstFlight(rocket.firstFlight) }}</dd>
          </dl>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useRocketStore } from "@/stores/rockets";
import {
  displayText,
  formatFirstFlight,
  formatLaunchCost,
} from "@/utils/rocket";

const route = useRoute("/rockets/[id]");
const store = useRocketStore();
const id = computed(() => String(route.params.id));
const rocket = computed(() => store.getRocket(id.value));
const name = computed(() =>
  displayText(rocket.value?.name, "Rocket tanpa nama"),
);
watch(
  id,
  (value) => {
    void store.loadDetail(value);
  },
  { immediate: true },
);
</script>

<style scoped>
.rocket-text {
  overflow-wrap: anywhere;
}

.description {
  white-space: pre-line;
}
</style>

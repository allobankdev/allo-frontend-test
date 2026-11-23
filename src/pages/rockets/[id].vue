<template>
  <v-container class="py-6">
    <v-btn
      variant="outlined"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
      @click="router.push('/')"
    >
      Kembali ke Daftar
    </v-btn>

    <!-- 1. State: LOADING -->
    <div v-if="store.isLoading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="mt-4 text-medium-emphasis">Memuat detail roket...</p>
    </div>

    <!-- 2. State: ERROR + RETRY -->
    <v-alert
      v-else-if="store.errorMessage"
      type="error"
      variant="tonal"
      class="my-6"
    >
      <div class="d-flex justify-space-between align-center flex-wrap ga-2">
        <span>{{ store.errorMessage }}</span>
        <v-btn color="error" size="small" @click="loadDetail"> Retry </v-btn>
      </div>
    </v-alert>

    <!-- 3. State: SUCCESS -->
    <v-card v-else-if="store.selectedRocket" class="overflow-hidden">
      <v-row no-gutters>
        <v-col cols="12" md="5">
          <v-img
            :src="imgSrc"
            height="100%"
            min-height="300"
            cover
            class="bg-grey-lighten-2"
            @error="imgSrc = fallbackImage"
          />
        </v-col>

        <v-col cols="12" md="7">
          <v-card-text class="pa-6">
            <h1 class="text-h4 font-weight-bold mb-3">
              {{ store.selectedRocket.name }}
            </h1>

            <p class="text-body-1 text-medium-emphasis mb-6">
              {{ store.selectedRocket.description }}
            </p>

            <v-divider class="mb-4" />

            <v-row>
              <v-col cols="12" sm="4">
                <div class="text-caption text-medium-emphasis">
                  Cost per Launch
                </div>
                <div class="text-subtitle-1 font-weight-bold">
                  {{ formatCost(store.selectedRocket.cost) }}
                </div>
              </v-col>

              <v-col cols="12" sm="4">
                <div class="text-caption text-medium-emphasis">Country</div>
                <div class="text-subtitle-1 font-weight-bold">
                  {{ store.selectedRocket.country }}
                </div>
              </v-col>

              <v-col cols="12" sm="4">
                <div class="text-caption text-medium-emphasis">
                  First Flight
                </div>
                <div class="text-subtitle-1 font-weight-bold">
                  {{ store.selectedRocket.firstFlight || "Belum diketahui" }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRocketStore } from "@/stores/rocketStore";

const route = useRoute();
const router = useRouter();
const store = useRocketStore();

const fallbackImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="22">No Rocket Image</text></svg>',
  );

const imgSrc = ref(fallbackImage);

watch(
  () => store.selectedRocket,
  (rocket) => {
    imgSrc.value = rocket?.image || fallbackImage;
  },
  { immediate: true },
);

function loadDetail() {
  const params = route.params as Record<string, string>;
  store.fetchRocketDetail(Number(params.id));
}

function formatCost(cost: number | null) {
  if (cost === null || cost === undefined) {
    return "Tidak tersedia";
  }
  return "$" + cost.toLocaleString("en-US");
}

onMounted(() => {
  loadDetail();
});
</script>

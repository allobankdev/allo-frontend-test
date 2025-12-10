<template>
  <v-container class="py-8">
    <v-btn
      class="mb-4"
      variant="text"
      prepend-icon="mdi-arrow-left"
      @click="goBack"
    >
      Back to list
    </v-btn>

    <!-- Error state -->
    <v-alert
      v-if="rocketStore.status === 'error'"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      <div class="d-flex align-center justify-space-between w-100">
        <span>{{ rocketStore.errorMessage || "Failed to load rockets." }}</span>
        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          @click="rocketStore.fetchRockets()"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <!-- Loading state -->
    <div
      v-if="rocketStore.status === 'loading'"
      class="d-flex justify-center my-10"
    >
      <v-progress-circular indeterminate size="64" />
    </div>

    <!-- Not found -->
    <v-alert v-else-if="!rocket" type="warning" variant="tonal">
      Rocket not found.
    </v-alert>

    <!-- Success -->
    <v-row v-else align="start" justify="space-between" class="mt-2">
      <v-col cols="12" md="5">
        <v-carousel
          v-if="rocket.flickr_images && rocket.flickr_images.length"
          hide-delimiter-background
          height="320"
        >
          <v-carousel-item
            v-for="(img, index) in rocket.flickr_images"
            :key="index"
          >
            <v-img :src="img" height="320" cover />
          </v-carousel-item>
        </v-carousel>

        <v-img
          v-else
          :src="fallbackImage"
          height="320"
          cover
          class="rounded-lg"
        >
          <template #error>
            <div class="d-flex align-center justify-center fill-height">
              <v-icon size="48"> mdi-rocket-launch-outline </v-icon>
            </div>
          </template>
        </v-img>
      </v-col>

      <v-col cols="12" md="7">
        <h1 class="text-h4 font-weight-bold mb-2">
          {{ rocket.name }}
        </h1>

        <div class="text-body-2 text-medium-emphasis mb-4">
          {{ rocket.description }}
        </div>

        <v-row>
          <v-col cols="12" sm="6">
            <v-card variant="tonal" class="mb-3">
              <v-card-title
                class="text-caption text-uppercase text-medium-emphasis"
              >
                Country
              </v-card-title>
              <v-card-text class="text-body-1">
                {{ rocket.country }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6">
            <v-card variant="tonal" class="mb-3">
              <v-card-title
                class="text-caption text-uppercase text-medium-emphasis"
              >
                First flight
              </v-card-title>
              <v-card-text class="text-body-1">
                {{ rocket.first_flight }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6">
            <v-card variant="tonal" class="mb-3">
              <v-card-title
                class="text-caption text-uppercase text-medium-emphasis"
              >
                Cost per launch
              </v-card-title>
              <v-card-text class="text-body-1">
                {{ formattedCostPerLaunch }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" v-if="rocket.isCustom">
            <v-chip color="primary" label> Custom rocket (local only) </v-chip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRocketStore } from "@/stores/rockets";

const rocketStore = useRocketStore();
const route = useRoute();
const router = useRouter();

const id = computed(() => String(route.params.id));
const rocket = computed(() => rocketStore.getById(id.value));

const fallbackImage = "https://images2.imgbox.com/3c/0e/T8iJcSN3_o.png";

onMounted(() => {
  if (rocketStore.status === "idle") {
    rocketStore.fetchRockets();
  }
});

const formattedCostPerLaunch = computed(() => {
  if (!rocket.value) return "-";
  const value = rocket.value.cost_per_launch;
  if (!value) return "-";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
});

function goBack() {
  router.push({ path: "/" });
}
</script>

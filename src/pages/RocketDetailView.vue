<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRocketStore } from "../stores/rocketStore";
import { formatCurrency } from "@/components/utils/helper";

const route = useRoute();
const router = useRouter();
const store = useRocketStore();

const rocketId = route.params.id as string;
const fallbackImage =
  "https://via.placeholder.com/800x400?text=No+Rocket+Image";

onMounted(() => {
  store.detailRocket(rocketId).then(() => {
    if (!store.selectedRocket) {
      router.replace({ name: "RocketList" });
    }
  });
  console.log("Found local rocket:", store.selectedRocket);
  store.successMessage = "Rocket details fetched successfully!";
});
</script>

<template>
  <v-container
    class="py-8"
    style="max-width: 900px"
  >
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      color="primary"
      class="mb-4"
      @click="router.back()"
    >
      Go back to Rocket List
    </v-btn>
    <v-snackbar
      :model-value="!!store.successMessage"
      color="success"
      location="bottom right"
      title="Successfully"
      :timeout="3000"
    >
      <p class="mb-4">
        {{ store.successMessage }}
      </p>
    </v-snackbar>

    <div
      v-if="store.loading"
      class="text-center py-12"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
      <p class="mt-4 text-body-1 text-medium-emphasis">
        loading rocket details...
      </p>
    </div>

    <v-alert
      v-else-if="store.error"
      type="error"
      variant="tonal"
      title="Terjadi Kesalahan"
    >
      <p class="mb-4">
        {{ store.error }}
      </p>
      <v-btn
        color="error"
        variant="elevated"
        prepend-icon="mdi-refresh"
        @click="store.detailRocket(rocketId)"
      >
        Try Again
      </v-btn>
    </v-alert>

    <v-card
      v-else-if="store.selectedRocket"
      elevation="3"
      class="overflow-hidden"
    >
      <v-img
        :src="store.selectedRocket.image_url || fallbackImage"
        height="380"
        cover
        class="bg-grey-lighten-2"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              indeterminate
              color="grey-lighten-1"
            />
          </div>
        </template>
      </v-img>

      <v-card-item class="pa-6">
        <div class="d-flex align-center justify-space-between mb-2">
          <v-card-title class="text-h4 font-weight-bold">
            {{ store.selectedRocket.full_name }}
          </v-card-title>
          <v-chip
            v-if="store.selectedRocket.isLocal"
            color="secondary"
            label
            size="small"
          >
            Data Local
          </v-chip>
        </div>

        <v-card-text class="pa-0">
          <p
            class="text-body-1 text-medium-emphasis my-4"
            style="line-height: 1.7"
          >
            {{
              store.selectedRocket.description ||
                "Deskripsi tidak tersedia untuk roket ini."
            }}
          </p>

          <v-divider class="my-6" />

          <h3 class="text-h6 mb-4 font-weight-bold">
            Specifications Launchers
          </h3>

          <v-table density="comfortable">
            <tbody>
              <tr>
                <td
                  class="font-weight-medium text-medium-emphasis"
                  style="width: 220px"
                >
                  <v-icon
                    icon="mdi-currency-usd"
                    class="mr-2"
                    color="primary"
                  />
                  Cost per Launch
                </td>
                <td class="font-weight-bold">
                  {{ formatCurrency(store.selectedRocket.launch_cost) }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-medium text-medium-emphasis">
                  <v-icon
                    icon="mdi-earth"
                    class="mr-2"
                    color="primary"
                  />
                  Country
                </td>
                <td>
                  {{ store.selectedRocket.manufacturer?.country_code || "N/A" }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-medium text-medium-emphasis">
                  <v-icon
                    icon="mdi-rocket"
                    class="mr-2"
                    color="primary"
                  />
                  First Flight
                </td>
                <td>
                  {{ store.selectedRocket.maiden_flight || "N/A" }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card-item>
    </v-card>
  </v-container>
</template>

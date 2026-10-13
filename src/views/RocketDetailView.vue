<template>
  <v-main class="bg-background">
    <v-container
      max-width="1180"
      class="py-7"
    >
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        color="blue-grey-lighten-2"
        class="mb-10 px-0"
        @click="router.push('/')"
      >
        Back to catalogue
      </v-btn>

      <v-row
        v-if="rocket"
        align="center"
        class="ga-12"
      >
        <v-col
          cols="12"
          md="6"
        >
          <v-card
            rounded="xl"
            elevation="0"
            color="#0b1725"
            class="overflow-hidden"
          >
            <v-img
              v-if="rocket.imageUrl"
              :src="rocket.imageUrl"
              :alt="rocket.name"
              height="540"
              cover
            />

            <div
              v-else
              class="d-flex align-center justify-center"
              style="
                height: 540px;
                background: radial-gradient(
                  circle at 50% 100%,
                  #183f5e,
                  #0b1725 68%
                );
              "
            >
              <v-icon
                size="100"
                color="primary"
              >
                mdi-rocket-launch-outline
              </v-icon>
            </div>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <div
            class="text-uppercase font-weight-bold"
            style="font-size: 11px; letter-spacing: 0.15em"
          >
            Rocket detail
          </div>

          <h1
            class="text-white font-weight-bold mt-4 mb-5"
            style="font-size: clamp(40px, 5vw, 70px); line-height: 1.05"
          >
            {{ rocket.name }}
          </h1>

          <p
            class="text-blue-grey-lighten-2 text-body-1 mb-0"
            style="line-height: 1.75; max-width: 520px"
          >
            {{
              rocket.description || "No description available for this rocket."
            }}
          </p>

          <v-row
            class="mt-10 pt-6"
            style="border-top: 1px solid #29435a"
          >
            <v-col cols="4">
              <div
                class="text-blue-grey-darken-1"
                style="font-size: 12px"
              >
                Cost per launch
              </div>

              <div
                class="text-white font-weight-bold mt-2"
                style="font-size: 15px"
              >
                {{ formatCost(rocket.launchCost) }}
              </div>
            </v-col>

            <v-col cols="4">
              <div
                class="text-blue-grey-darken-1"
                style="font-size: 12px"
              >
                Country
              </div>

              <div
                class="text-white font-weight-bold mt-2"
                style="font-size: 15px"
              >
                {{ rocket.country || "Not available" }}
              </div>
            </v-col>

            <v-col cols="4">
              <div
                class="text-blue-grey-darken-1"
                style="font-size: 12px"
              >
                First flight
              </div>

              <div
                class="text-white font-weight-bold mt-2"
                style="font-size: 15px"
              >
                {{ formatDate(rocket.maidenFlight) }}
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-card
        v-else
        min-height="300"
        color="#101d2c"
        elevation="0"
        rounded="xl"
        class="d-flex flex-column align-center justify-center ga-4"
      >
        <v-icon
          size="42"
          color="blue-grey-lighten-2"
        >
          mdi-help-circle-outline
        </v-icon>

        <h2 class="text-white">
          Rocket not found
        </h2>

        <v-btn
          color="primary"
          @click="router.push('/')"
        >
          Return to catalogue
        </v-btn>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRocketStore } from "@/stores/rockets";

const route = useRoute();
const router = useRouter();
const store = useRocketStore();

const rocket = computed(() => store.findRocket(String(route.params.id)));

const formatCost = (value: number | null) =>
  value === null ? "Not available" : `$${value.toLocaleString()}`;

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

onMounted(() => {
  if (store.status === "idle") {
    void store.loadRockets();
  }
});
</script>

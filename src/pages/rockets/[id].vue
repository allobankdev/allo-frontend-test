<template>
  <div class="pa-4 bg-grey-darken-4 min-vh-100">
    <v-container>
      <v-btn
        prepend-icon="mdi-arrow-left"
        variant="text"
        color="orange"
        class="mb-6"
        @click="router.push('/')"
      >
        Back to List
      </v-btn>

      <div v-if="rocket">
        <v-row>
          <v-col cols="12" md="6">
            <v-img
              :src="rocket.flickr_images?.[0]"
              class="rounded-xl border-sm"
              style="border-color: rgba(255, 152, 0, 0.3) !important"
              cover
              height="400"
            ></v-img>
          </v-col>

          <v-col cols="12" md="6">
            <h1 class="text-h3 font-weight-bold text-orange mb-2">
              {{ rocket.name }}
            </h1>
            <v-chip
              :color="rocket.active ? 'success' : 'error'"
              class="mb-4"
              label
            >
              {{ rocket.active ? "ACTIVE" : "INACTIVE" }}
            </v-chip>

            <p class="text-body-1 text-grey-lighten-1 mb-6">
              {{ rocket.description }}
            </p>

            <v-card color="grey-darken-3" rounded="lg" class="pa-4">
              <v-row class="text-center">
                <v-col cols="6">
                  <div class="text-caption text-grey">FIRST FLIGHT</div>
                  <div class="text-h6 text-white">
                    {{ rocket.first_flight }}
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-grey">COST PER LAUNCH</div>
                  <div class="text-h6 text-orange">
                    $ {{ rocket.cost_per_launch?.toLocaleString() || "N/A" }}
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-8">
          <v-col cols="12">
            <h2 class="text-h5 text-white mb-4 border-b-sm pb-2">
              Technical Specifications
            </h2>
            <v-row>
              <v-col cols="12" sm="4">
                <v-list bg-color="transparent" theme="dark">
                  <v-list-item
                    title="Country"
                    :subtitle="rocket.country || 'United States'"
                  ></v-list-item>
                  <v-list-item
                    title="Height"
                    :subtitle="
                      rocket.height?.meters
                        ? rocket.height.meters + ' Meters'
                        : 'N/A'
                    "
                  ></v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="4">
                <v-list bg-color="transparent" theme="dark">
                  <v-list-item
                    title="Mass"
                    :subtitle="
                      rocket.mass?.kg
                        ? rocket.mass.kg.toLocaleString() + ' Kg'
                        : 'N/A'
                    "
                  ></v-list-item>
                  <v-list-item
                    title="Stages"
                    :subtitle="rocket.stages"
                  ></v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="4">
                <v-list bg-color="transparent" theme="dark">
                  <v-list-item
                    title="Success Rate"
                    :subtitle="(rocket.success_rate_pct || 0) + '%'"
                  ></v-list-item>
                  <v-list-item
                    title="Boosters"
                    :subtitle="rocket.boosters"
                  ></v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>

      <div v-else class="text-center mt-12">
        <v-progress-circular indeterminate color="orange"></v-progress-circular>
        <p class="mt-4 text-grey">Loading rocket data or rocket not found...</p>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRocketStore } from "@/utils/store/rocket.store";

const route = useRoute();
const router = useRouter();
const rocketStore = useRocketStore();

const rocketId = route.params.id as string;

const rocket = computed(() => {
  return rocketStore.list.find((r) => r.id === rocketId);
});

onMounted(() => {
  if (rocketStore.list.length === 0) {
    rocketStore.fetchList();
  }
});
</script>

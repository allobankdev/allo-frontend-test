<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <!-- Loading -->
        <v-skeleton-loader
          type="card, article, article"
          elevation="2"
          v-if="isLoading"
        />

        <!-- Error -->
        <error-component v-else-if="error" @refresh="refetch" />

        <!-- Data Loaded -->
        <v-card v-else-if="data" elevation="2" class="rounded-xl">
          <!-- Image Gallery -->
          <v-carousel
            v-if="data.data.flickr_images.length > 0"
            cycle
            height="400"
            hide-delimiters
            show-arrows-on-hover
          >
            <v-carousel-item
              v-for="(image, i) in data.data.flickr_images"
              :key="i"
              :src="image"
              cover
            ></v-carousel-item>
          </v-carousel>
          <v-img
            v-else
            src="https://via.placeholder.com/800x400?text=No+Image+Available"
            height="400"
            cover
          ></v-img>

          <v-card-title class="text-h4 font-weight-bold pt-6">
            {{ data.data.name }}
            <v-chip
              :color="data.data.active ? 'success' : 'error'"
              class="ml-2"
              small
            >
              {{ data.data.active ? "ACTIVE" : "INACTIVE" }}
            </v-chip>
          </v-card-title>

          <v-card-subtitle class="text-h6">
            {{ data.data.type }} • {{ data.data.company }} •
            {{ data.data.country }}
          </v-card-subtitle>

          <v-card-text>
            <p class="text-body-1 mb-6">{{ data.data.description }}</p>

            <v-divider class="my-4" />

            <!-- Basic Stats -->
            <v-row>
              <v-col cols="6" sm="3">
                <stat-card
                  title="First Flight"
                  :value="formatDate(data.data.first_flight)"
                  icon="mdi-calendar"
                />
              </v-col>
              <v-col cols="6" sm="3">
                <stat-card
                  title="Cost per Launch"
                  :value="'$' + data.data.cost_per_launch.toLocaleString()"
                  icon="mdi-cash"
                />
              </v-col>
              <v-col cols="6" sm="3">
                <stat-card
                  title="Success Rate"
                  :value="data.data.success_rate_pct + '%'"
                  icon="mdi-trending-up"
                />
              </v-col>
              <v-col cols="6" sm="3">
                <stat-card
                  title="Stages"
                  :value="data.data.stages"
                  icon="mdi-rocket"
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- Dimensions Section -->
            <v-expansion-panels class="mb-6">
              <v-expansion-panel>
                <v-expansion-panel-title class->
                  <v-icon left>mdi-ruler</v-icon>
                  Dimensions & Mass
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-arrow-up-down</v-icon>
                        </template>
                        <v-list-item-title>Height</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ data.data.height.meters }} m /
                          {{ data.data.height.feet }} ft
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-diameter</v-icon>
                        </template>
                        <v-list-item-title>Diameter</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ data.data.diameter.meters }} m /
                          {{ data.data.diameter.feet }} ft
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-weight-kilogram</v-icon>
                        </template>
                        <v-list-item-title>Mass</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ data.data.mass.kg.toLocaleString() }} kg /
                          {{ data.data.mass.lb.toLocaleString() }} lb
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Engine Details -->
            <v-expansion-panels class="mb-6">
              <v-expansion-panel>
                <v-expansion-panel-title class->
                  <v-icon left>mdi-engine</v-icon>
                  Engine Specifications
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-list lines="two">
                        <v-list-item>
                          <template v-slot:prepend>
                            <v-icon>mdi-numeric</v-icon>
                          </template>
                          <v-list-item-title
                            >Number of Engines</v-list-item-title
                          >
                          <v-list-item-subtitle>{{
                            data.data.engines.number
                          }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                          <template v-slot:prepend>
                            <v-icon>mdi-cog</v-icon>
                          </template>
                          <v-list-item-title>Engine Type</v-list-item-title>
                          <v-list-item-subtitle
                            >{{ data.data.engines.type }} ({{
                              data.data.engines.version
                            }})</v-list-item-subtitle
                          >
                        </v-list-item>
                        <v-list-item>
                          <template v-slot:prepend>
                            <v-icon>mdi-vector-arrange-above</v-icon>
                          </template>
                          <v-list-item-title>Layout</v-list-item-title>
                          <v-list-item-subtitle>{{
                            data.data.engines.layout
                          }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                          <template v-slot:prepend>
                            <v-icon>mdi-gas-station</v-icon>
                          </template>
                          <v-list-item-title>Propellants</v-list-item-title>
                          <v-list-item-subtitle
                            >{{ data.data.engines.propellant_1 }} &
                            {{
                              data.data.engines.propellant_2
                            }}</v-list-item-subtitle
                          >
                        </v-list-item>
                      </v-list>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-list lines="two">
                        <v-list-item>
                          <template v-slot:prepend>
                            <v-icon>mdi-speedometer</v-icon>
                          </template>
                          <v-list-item-title
                            >Thrust (Sea Level)</v-list-item-title
                          >
                          <v-list-item-subtitle
                            >{{ data.data.engines.thrust_sea_level.kN }} kN /
                            {{
                              data.data.engines.thrust_sea_level.lbf.toLocaleString()
                            }}
                            lbf</v-list-item-subtitle
                          >
                        </v-list-item>
                        <v-list-item>
                          <template v-slot:prepend>
                            <v-icon>mdi-speedometer</v-icon>
                          </template>
                          <v-list-item-title>Thrust (Vacuum)</v-list-item-title>
                          <v-list-item-subtitle
                            >{{ data.data.engines.thrust_vacuum.kN }} kN /
                            {{
                              data.data.engines.thrust_vacuum.lbf.toLocaleString()
                            }}
                            lbf</v-list-item-subtitle
                          >
                        </v-list-item>
                        <v-list-item>
                          <template v-slot:prepend>
                            <v-icon>mdi-isp</v-icon>
                          </template>
                          <v-list-item-title>ISP</v-list-item-title>
                          <v-list-item-subtitle>
                            Sea Level: {{ data.data.engines.isp.sea_level }}s •
                            Vacuum: {{ data.data.engines.isp.vacuum }}s
                          </v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                          <template v-slot:prepend>
                            <v-icon>mdi-weight</v-icon>
                          </template>
                          <v-list-item-title
                            >Thrust to Weight</v-list-item-title
                          >
                          <v-list-item-subtitle>{{
                            data.data.engines.thrust_to_weight
                          }}</v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Stage Details -->
            <v-expansion-panels class="mb-6">
              <v-expansion-panel>
                <v-expansion-panel-title class->
                  <v-icon left>mdi-rocket-launch</v-icon>
                  Stage Information
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <!-- First Stage -->
                  <v-card outlined class="mb-4">
                    <v-card-title class="text-h6">
                      First Stage
                      <v-chip
                        small
                        class="ml-2"
                        v-if="data.data.first_stage.reusable"
                      >
                        <v-icon small left>mdi-repeat</v-icon>
                        Reusable
                      </v-chip>
                    </v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-list lines="two">
                            <v-list-item>
                              <v-list-item-title>Engines</v-list-item-title>
                              <v-list-item-subtitle>{{
                                data.data.first_stage.engines
                              }}</v-list-item-subtitle>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title>Fuel Amount</v-list-item-title>
                              <v-list-item-subtitle
                                >{{
                                  data.data.first_stage.fuel_amount_tons
                                }}
                                tons</v-list-item-subtitle
                              >
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title>Burn Time</v-list-item-title>
                              <v-list-item-subtitle
                                >{{
                                  data.data.first_stage.burn_time_sec
                                }}
                                seconds</v-list-item-subtitle
                              >
                            </v-list-item>
                          </v-list>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-list lines="two">
                            <v-list-item>
                              <v-list-item-title
                                >Thrust (Sea Level)</v-list-item-title
                              >
                              <v-list-item-subtitle>
                                {{ data.data.first_stage.thrust_sea_level.kN }}
                                kN /
                                {{
                                  data.data.first_stage.thrust_sea_level.lbf.toLocaleString()
                                }}
                                lbf
                              </v-list-item-subtitle>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title
                                >Thrust (Vacuum)</v-list-item-title
                              >
                              <v-list-item-subtitle>
                                {{ data.data.first_stage.thrust_vacuum.kN }} kN
                                /
                                {{
                                  data.data.first_stage.thrust_vacuum.lbf.toLocaleString()
                                }}
                                lbf
                              </v-list-item-subtitle>
                            </v-list-item>
                          </v-list>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <!-- Second Stage -->
                  <v-card outlined>
                    <v-card-title class="text-h6">
                      Second Stage
                      <v-chip
                        small
                        class="ml-2"
                        v-if="data.data.second_stage.reusable"
                      >
                        <v-icon small left>mdi-repeat</v-icon>
                        Reusable
                      </v-chip>
                    </v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-list lines="two">
                            <v-list-item>
                              <v-list-item-title>Engines</v-list-item-title>
                              <v-list-item-subtitle>{{
                                data.data.second_stage.engines
                              }}</v-list-item-subtitle>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title>Fuel Amount</v-list-item-title>
                              <v-list-item-subtitle
                                >{{
                                  data.data.second_stage.fuel_amount_tons
                                }}
                                tons</v-list-item-subtitle
                              >
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title>Burn Time</v-list-item-title>
                              <v-list-item-subtitle
                                >{{
                                  data.data.second_stage.burn_time_sec
                                }}
                                seconds</v-list-item-subtitle
                              >
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title>Thrust</v-list-item-title>
                              <v-list-item-subtitle>
                                {{ data.data.second_stage.thrust.kN }} kN /
                                {{
                                  data.data.second_stage.thrust.lbf.toLocaleString()
                                }}
                                lbf
                              </v-list-item-subtitle>
                            </v-list-item>
                          </v-list>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-list lines="two">
                            <v-list-item>
                              <v-list-item-title
                                >Payload Fairing</v-list-item-title
                              >
                              <v-list-item-subtitle>
                                Height:
                                {{
                                  data.data.second_stage.payloads
                                    .composite_fairing.height.meters
                                }}m /
                                {{
                                  data.data.second_stage.payloads
                                    .composite_fairing.height.feet
                                }}ft
                                <br />
                                Diameter:
                                {{
                                  data.data.second_stage.payloads
                                    .composite_fairing.diameter.meters
                                }}m /
                                {{
                                  data.data.second_stage.payloads
                                    .composite_fairing.diameter.feet
                                }}ft
                              </v-list-item-subtitle>
                            </v-list-item>
                          </v-list>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Additional Information -->
            <v-expansion-panels class="mb-6">
              <v-expansion-panel>
                <v-expansion-panel-title class->
                  <v-icon left>mdi-information</v-icon>
                  Additional Information
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-list lines="two">
                        <v-list-item>
                          <v-list-item-title>Landing Legs</v-list-item-title>
                          <v-list-item-subtitle>
                            Number: {{ data.data.landing_legs.number }}
                            <span v-if="data.data.landing_legs.material">
                              • Material:
                              {{ data.data.landing_legs.material }}</span
                            >
                          </v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-title>Boosters</v-list-item-title>
                          <v-list-item-subtitle>{{
                            data.data.boosters
                          }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-title>Engine Loss Max</v-list-item-title>
                          <v-list-item-subtitle>{{
                            data.data.engines.engine_loss_max
                          }}</v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-list lines="two">
                        <v-list-item>
                          <v-list-item-title>Payload Weights</v-list-item-title>
                          <v-list-item-subtitle>
                            <div
                              v-for="(payload, index) in data.data
                                .payload_weights"
                              :key="index"
                              class="mb-2"
                            >
                              <strong>{{ payload.name }}:</strong>
                              {{ payload.kg.toLocaleString() }} kg /
                              {{ payload.lb.toLocaleString() }} lb
                            </div>
                          </v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-divider class="my-4" />

            <div class="d-flex justify-space-between align-center">
              <v-btn
                color="primary"
                :href="data.data.wikipedia"
                target="_blank"
                prepend-icon="mdi-wikipedia"
                size="large"
              >
                Wikipedia Page
              </v-btn>

              <v-chip-group>
                <v-chip
                  v-if="data.data.active"
                  color="success"
                  prepend-icon="mdi-check-circle"
                >
                  Active
                </v-chip>
                <v-chip v-else color="error" prepend-icon="mdi-close-circle">
                  Inactive
                </v-chip>
                <v-chip prepend-icon="mdi-calendar">
                  First Flight: {{ formatDate(data.data.first_flight) }}
                </v-chip>
              </v-chip-group>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import apiInstance from "@/utils/api";
import type { Rocket } from "@/types/rocket.type";

const route = useRoute();
const rocketId = route.params.id;

const fetchRocket = async () => {
  const response = await apiInstance.get<Rocket>(`/v4/rockets/${rocketId}`);
  return { data: response.data };
};

const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["rocket"],
  queryFn: fetchRocket,
});

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
</script>

<style lang="scss" scoped>
.v-card {
  overflow: hidden;

  &-title {
    word-break: break-word;
  }
}

.v-carousel {
  border-radius: 12px 12px 0 0 !important;
}

.stat-card {
  border-radius: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  height: 100%;

  &__title {
    font-size: 0.8rem;
    color: rgba(0, 0, 0, 0.6);
  }

  &__value {
    font-size: 1.2rem;
    font-weight: bold;
  }
}

.v-expansion-panel-title {
  display: flex;
  gap: 1rem;
}
</style>

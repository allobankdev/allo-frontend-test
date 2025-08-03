<template>
  <v-container class="py-8">
    <!-- Loading State -->
    <v-row
      v-if="isLoading"
      justify="center"
    >
      <v-col
        cols="12"
        md="12"
      >
        <SkeletonLoader
          type="image, article"
          height="400px"
        />
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error">
      <v-col>
        <ErrorComponent @refresh="refetch" />
      </v-col>
    </v-row>

    <!-- Data Loaded -->
    <v-row
      v-else-if="data"
      justify="center"
    >
      <v-col
        cols="12"
        md="12"
      >
        <v-card
          class="crew-card"
          elevation="4"
        >
          <v-row no-gutters>
            <!-- Image Column (Left) -->
            <v-col
              cols="12"
              md="5"
              class="image-col"
            >
              <div class="crew-image-container">
                <v-img
                  :src="
                    data.data.image ||
                      'https://via.placeholder.com/500x700?text=No+Image'
                  "
                  height="100%"
                  min-height="500px"
                  cover
                  class="crew-image"
                  gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5)"
                >
                  <template #placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-icon size="x-large">
                        mdi-account-astronaut
                      </v-icon>
                    </v-row>
                  </template>

                  <v-chip
                    class="status-chip"
                    :color="getStatusColor(data.data.status)"
                    size="small"
                  >
                    {{ formatStatus(data.data.status) }}
                  </v-chip>
                </v-img>
              </div>
            </v-col>

            <!-- Information Column (Right) -->
            <v-col
              cols="12"
              md="7"
              class="info-col"
            >
              <v-card-text class="pa-6">
                <v-card-title class="text-h3 mb-4">
                  {{ data.data.name || "Unknown Astronaut" }}
                </v-card-title>

                <v-card-subtitle
                  v-if="data.data.agency"
                  class="text-h5 mb-6"
                >
                  {{ data.data.agency }}
                </v-card-subtitle>

                <v-divider class="my-6" />

                <!-- Details Section -->
                <div class="mb-8">
                  <h3 class="text-h5 mb-4">
                    Crew Information
                  </h3>

                  <v-list
                    density="comfortable"
                    class="transparent"
                  >
                    <v-list-item>
                      <template #prepend>
                        <v-icon
                          size="large"
                          color="primary"
                        >
                          mdi-badge-account
                        </v-icon>
                      </template>
                      <v-list-item-title class="text-h6">
                        ID
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-body-1">
                        {{ data.data.id }}
                      </v-list-item-subtitle>
                    </v-list-item>

                    <v-list-item>
                      <template #prepend>
                        <v-icon
                          size="large"
                          color="primary"
                        >
                          mdi-account-group
                        </v-icon>
                      </template>
                      <v-list-item-title class="text-h6">
                        Agency
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-body-1">
                        {{ data.data.agency || "Unknown" }}
                      </v-list-item-subtitle>
                    </v-list-item>

                    <v-list-item>
                      <template #prepend>
                        <v-icon
                          size="large"
                          color="primary"
                        >
                          mdi-rocket-launch
                        </v-icon>
                      </template>
                      <v-list-item-title class="text-h6">
                        Launch Missions
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-body-1">
                        {{ data.data.launches.length }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </div>

                <!-- Launches Section -->
                <div
                  v-if="data.data.launches.length > 0"
                  class="mb-8"
                >
                  <h3 class="text-h5 mb-4">
                    Participated Launches
                  </h3>
                  <div class="chips-container">
                    <v-chip
                      v-for="(launch, index) in data.data.launches"
                      :key="index"
                      class="ma-1"
                      color="primary"
                      variant="outlined"
                      size="large"
                    >
                      {{ launch }}
                    </v-chip>
                  </div>
                </div>

                <!-- Wikipedia Link -->
                <v-btn
                  v-if="data.data.wikipedia"
                  color="primary"
                  variant="flat"
                  :href="data.data.wikipedia"
                  target="_blank"
                  size="x-large"
                  prepend-icon="mdi-wikipedia"
                  class="mt-6"
                >
                  View on Wikipedia
                </v-btn>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { formatStatus, getStatusColor } from "@/utils/helper";
import { useCrewsStore } from "@/store/crews.store";

const route = useRoute();
const crewId = route.params.id as string;
const crewsStore = useCrewsStore();

const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["crew-detail"],
  queryFn: () => crewsStore.getCrewById(crewId),
});
</script>

<style scoped lang="scss">
.crew-card {
  border-radius: 12px;
  overflow: hidden;
}

.image-col {
  padding: 0;
}

.info-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.crew-image-container {
  position: relative;
  height: 100%;
}

.crew-image {
  transition: transform 0.3s ease;
  height: 100%;
}

.crew-card:hover .crew-image {
  transform: scale(1.02);
}

.status-chip {
  position: absolute;
  top: 16px;
  right: 16px;
  font-weight: 600;
  text-transform: capitalize;
}

.transparent {
  background-color: transparent !important;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
}

@media (max-width: 960px) {
  .image-col,
  .info-col {
    width: 100%;
  }

  .crew-image {
    min-height: 400px;
  }
}
</style>

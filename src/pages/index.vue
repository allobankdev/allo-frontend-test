<template>
  <v-container class="mt-10">
    <!-- Title -->
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">
      <div class="text-center">
        <div class="text-body-2 font-weight-light mb-n1">List of</div>
        <h1 class="text-h2 font-weight-bold">🚀Rockets🚀</h1>
      </div>

      <!-- Button Add Rocket -->
      <div>
        <v-row justify="end">
          <v-col class="d-flex justify-end">
            <v-btn color="white" text @click="handleAddRocket">
              <v-icon left>mdi-plus</v-icon>
              ADD ROCKET
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <!-- Search (Textbox) -->
      <div class="d-flex justify-center mt-10">
        <v-text-field
          v-model="searchRocket"
          prepend-icon="mdi-magnify"
          label="Search rocket name..."
          single-line
          hide-details
        />
      </div>

      <!-- Cards -->
      <div v-if="filteredRockets.length > 0" class="mt-10">
        <div v-for="rocket in filteredRockets" :key="rocket.id" class="mb-6">
          <v-card class="mx-auto" max-width="700">
            <div class="d-flex flex-wrap">
              <!-- Image section -->
              <div class="rocket-image" style="width: 200px">
                <v-img
                  :src="rocket.links.patch.small"
                  height="200"
                  cover
                  class="rounded-s"
                ></v-img>
              </div>

              <!-- Content section -->
              <div class="flex-grow-1">
                <v-card-title>{{ rocket.name }}</v-card-title>
                <v-card-text>
                  <p>{{ rocket.description || "No Description" }}</p>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    variant="text"
                    color="primary"
                    @click="handleViewDetail(rocket.id)"
                  >
                    View Details
                  </v-btn>
                </v-card-actions>
              </div>
            </div>
          </v-card>
        </div>
      </div>
      <div v-else-if="!loading && !failed" class="text-center py-5">
        <h4>
          No rockets found.
          {{
            searchRocket
              ? "Please try with another key"
              : "Add your first rocket!"
          }}
        </h4>
      </div>

      <!-- Modal Loading -->
      <v-dialog v-model="loading" persistent max-width="400px">
        <v-card class="pa-4">
          <v-card-title class="headline text-center">Loading...</v-card-title>
          <v-card-subtitle class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            ></v-progress-circular>
          </v-card-subtitle>
        </v-card>
      </v-dialog>

      <!-- Modal Failed To Get Data -->
      <v-dialog v-model="failed" persistent max-width="400px">
        <v-card class="pa-4">
          <v-row class="d-flex justify-center align-center pa-4">
            <v-icon x-large color="red">mdi-alert-circle-outline</v-icon>
          </v-row>
          <v-card-title class="headline text-center"
            >Something went wrong!</v-card-title
          >
          <div class="text-center mb-5">
            Failed to fetch data. Please try again!
          </div>
          <v-card-subtitle class="text-center">
            <v-btn color="white" text @click="handleRetry">
              <v-icon left>mdi-reload</v-icon>
              Retry again
            </v-btn>
          </v-card-subtitle>
        </v-card>
      </v-dialog>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import api from "../services/api";

interface Rocket {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  country: string;
  firstFlight: string;
  cost: number;
  links?: {
    patch: {
      small: string;
    };
  };
}

const router = useRouter();
const rockets = ref<Rocket[]>([]);
const loading = ref(false);
const failed = ref(false);
const searchRocket = ref("");

const filteredRockets = computed(() => {
  if (!searchRocket.value) {
    return rockets.value;
  }

  const search = searchRocket.value.toLowerCase();
  return rockets.value.filter((rocket) =>
    rocket.name.toLowerCase().includes(search)
  );
});

const handleAddRocket = () => {
  router.push({ name: "AddRocket" });
};

const handleViewDetail = (id: string | number) => {
  const selectedRocket = rockets.value.find((rocket) => rocket.id === id);

  if (selectedRocket) {
    localStorage.setItem("selectedRocket", JSON.stringify(selectedRocket));
    router.push({ name: "ViewDetail", params: { id } });
  }
};

const handleRetry = () => {
  failed.value = false;
  getRockets();
};

const getRockets = async () => {
  loading.value = true;
  try {
    const storedRockets = localStorage.getItem("rockets-data");
    let localRockets: Rocket[] = [];

    if (storedRockets) {
      localRockets = JSON.parse(storedRockets).map((rocket: any) => ({
        id: rocket.id.toString(),
        name: rocket.name,
        description: rocket.description,
        links: {
          patch: {
            small: rocket.img,
          },
        },
        country: rocket.country,
        firstFlight: rocket.firstFlight,
        cost: rocket.cost,
      }));
    }

    const response = await api.getRockets();
    let apiRockets: Rocket[] = [];

    if (Array.isArray(response.data)) {
      apiRockets = response.data;
    } else if (response.data && typeof response.data === "object") {
      apiRockets = [response.data];
    }

    rockets.value = [...apiRockets, ...localRockets];
  } catch (error) {
    failed.value = true;
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getRockets();
});
</script>

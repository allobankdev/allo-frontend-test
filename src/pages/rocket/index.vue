<script setup lang="ts">
import AddRocketModal from "@/components/AddRocketModal.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import RocketFilter from "@/components/RocketFilter.vue";
import router from "@/router";
import { useRocketStore } from "@/stores/rocketStore";
import type { Rocket } from "@/types/rocket";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";

const rocketStore = useRocketStore();
const { fetchRockets, removeRocket } = rocketStore;
const { loading, allRockets, rockets, error } = storeToRefs(rocketStore);

const showModal = ref(false);
const search = ref<string>("");
const selectedCountry = ref<string>("All Country");
const snackbar = ref<boolean>(false);
const snackbarText = ref<string>("");

const filteredRockets = computed(() => {
  let list = allRockets.value;

  // Filter by country
  if (selectedCountry.value !== "All Country") {
    list = list.filter((r) => r.country === selectedCountry.value);
  }

  // Filter by search
  if (search.value.trim()) {
    list = list.filter((r) =>
      r.name.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  return list;
});

const filterCountry = computed(() => {
  const countries = rockets.value.map((r) => r.country);
  return ["All Country", ...new Set(countries)];
});

const onDetailRocket = (rocket: Rocket) => {
  router.push(`/rocket/${rocket.id}`);
};

const handleSuccess = () => {
  snackbarText.value = "Rocket added successfully";
  snackbar.value = true;
};

onMounted(() => {
  fetchRockets();
});
</script>

<template>
  <v-container>
    <v-btn prepend-icon="mdi-arrow-left" variant="text" @click="$router.back()">
      Back
    </v-btn>

    <RocketFilter
      v-model:search="search"
      v-model:country="selectedCountry"
      :countries="filterCountry"
    />

    <ErrorMessage
      v-if="error"
      handleSuccess
      title="Failed to load rockets"
      :message="error.message"
      show-retry
      @retry="fetchRockets"
    />

    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" />
      </v-col>
    </v-row>

    <v-row v-if="!loading && !error">
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card @click="onDetailRocket(rocket)">
          <v-img
            :src="rocket.flickr_images?.[0] || '/no-image.png'"
            height="200px"
            cover
          />
          <v-card-title class="d-flex justify-space-between align-center">
            <span>{{ rocket.name }}</span>
            <v-btn
              v-if="rocket.id.startsWith('local-')"
              icon="mdi-delete"
              color="red"
              variant="text"
              @click.stop="removeRocket(rocket.id)"
            />
          </v-card-title>
          <v-card-text class="text-truncate-3 mb-4">
            {{ rocket.description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-btn
      color="grey-lighten-4"
      variant="flat"
      size="large"
      class="fab text-blue"
      icon="mdi-plus"
      @click="showModal = true"
    />

    <AddRocketModal
      v-model="showModal"
      @success="handleSuccess"
      @close="showModal = false"
    />

    <v-snackbar
      v-model="snackbar"
      color="green-darken-2"
      timeout="5000"
      location="top"
    >
      {{ snackbarText }}

      <template #actions>
        <v-btn variant="text" color="white" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  max-height: 4.5em;
  line-height: 1.5em;
}

.fab {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
</style>

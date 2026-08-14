<template>
  <v-container class="py-8">
    <div
      class="d-flex flex-column flex-md-row justify-space-between align-center mb-8"
    >
      <div>
        <h1 class="text-h3 font-weight-bold mb-2">SpaceX Rockets</h1>
        <p class="text-body-1 text-medium-emphasis">
          Explore the fleet of SpaceX launch vehicles.
        </p>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        size="large"
        rounded="pill"
        elevation="2"
        class="mt-4 mt-md-0 text-none"
        @click="showAddDialog = true"
      >
        Tambah Roket
      </v-btn>
    </div>

    <!-- Filter Input -->
    <v-row class="mb-6">
      <v-col cols="12" md="6" lg="4">
        <v-text-field
          v-model="searchInput"
          label="Cari Roket..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          rounded="pill"
          hide-details
          clearable
          bg-color="surface"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- State Feedback -->
    <StateFeedback
      v-if="store.isLoading || store.errorMessage"
      :is-loading="store.isLoading"
      :error-message="store.errorMessage"
      @retry="fetchData"
    />

    <!-- Empty State -->
    <v-row v-else-if="filteredRockets.length === 0">
      <v-col cols="12" class="text-center py-10">
        <v-icon
          icon="mdi-rocket-off-outline"
          size="64"
          color="grey"
          class="mb-4"
        ></v-icon>
        <h3 class="text-h5 text-medium-emphasis">
          Tidak ada roket yang ditemukan
        </h3>
        <p class="text-body-1 text-grey">
          Coba gunakan kata kunci pencarian yang lain.
        </p>
      </v-col>
    </v-row>

    <!-- Rocket Grid -->
    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <AddRocketDialog v-model="showAddDialog" @success="onRocketAdded" />

    <v-snackbar
      v-model="showSnackbar"
      color="success"
      timeout="3000"
      rounded="pill"
    >
      Roket berhasil ditambahkan!
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="showSnackbar = false"
          >Tutup</v-btn
        >
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRocketStore } from "../stores/rocketStore";
import RocketCard from "../components/RocketCard.vue";
import AddRocketDialog from "../components/AddRocketDialog.vue";
import StateFeedback from "../components/StateFeedback.vue";

const store = useRocketStore();
const searchInput = ref("");
const searchQuery = ref("");
const showAddDialog = ref(false);
const showSnackbar = ref(false);

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

watch(searchInput, (newValue) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    searchQuery.value = newValue;
  }, 300);
});

const filteredRockets = computed(() => {
  return store.filteredRockets(searchQuery.value);
});

const fetchData = () => {
  store.fetchRockets();
};

const onRocketAdded = () => {
  showSnackbar.value = true;
};

onMounted(() => {
  if (store.rockets.length === 0) {
    fetchData();
  }
});
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h4 font-weight-bold mb-6">
      SpaceX Rockets
    </h1>

    <v-row
      class="mb-6"
      align="center"
      justify="space-between"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <v-text-field
          v-model="searchQuery"
          placeholder="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          rounded="pill"
          hide-details
          single-line
          density="comfortable"
        />
      </v-col>
      <v-col
        cols="12"
        sm="4"
        md="4"
        class="text-sm-right"
      >
        <v-btn
          color="white"
          variant="flat"
          prepend-icon="mdi-plus"
          size="large"
          @click="isModalOpen = true"
        >
          Tambah Roket
        </v-btn>
      </v-col>
    </v-row>

    <v-row
      v-if="isLoading"
      justify="center"
      class="mt-12"
    >
      <v-col class="text-center">
        <v-progress-circular
          indeterminate
          color="black"
          size="64"
        />
        <p class="mt-4 text-grey-darken-1">
          Mengambil data dari angkasa...
        </p>
      </v-col>
    </v-row>

    <v-row
      v-else-if="isError"
      justify="center"
      class="mt-12"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
        class="text-center"
      >
        <v-icon
          color="error"
          size="64"
          class="mb-4"
        >
          mdi-alert-circle
        </v-icon>
        <h3 class="text-h6 mb-4">
          Gagal memuat data dari server
        </h3>
        <v-btn
          color="error"
          variant="flat"
          @click="refetch"
        >
          <v-icon start>
            mdi-refresh
          </v-icon> Coba Lagi
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketCard :rocket="rocket" />
      </v-col>

      <v-col
        v-if="filteredRockets.length === 0"
        cols="12"
        class="text-center mt-12"
      >
        <v-icon
          size="64"
          color="grey-lighten-1"
        >
          mdi-rocket-off
        </v-icon>
        <p class="text-h6 text-grey mt-4">
          Roket tidak ditemukan.
        </p>
      </v-col>
    </v-row>
    <AddRocketModal v-model="isModalOpen" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { useRocketStore } from "../stores/rocketStore";
import { rocketApi } from "../api/rocketApi";
import RocketCard from "../components/RocketCard.vue";
import AddRocketModal from "../components/AddRocketModal.vue";

const searchQuery = ref("");
const isModalOpen = ref(false);

const {
  data: apiRockets,
  isLoading,
  isError,
  refetch,
} = useQuery({
  queryKey: ["rockets"],
  queryFn: rocketApi.getSpaceXRockets,
  retry: 1,
});

const rocketStore = useRocketStore();

const filteredRockets = computed(() => {
  const combined = [...rocketStore.localRockets, ...(apiRockets.value || [])];
  if (!searchQuery.value) return combined;

  const lowerSearch = searchQuery.value.toLowerCase();
  return combined.filter((rocket) =>
    rocket.full_name.toLowerCase().includes(lowerSearch),
  );
});
</script>

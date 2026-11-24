<template>
  <v-container
    class="py-8"
    style="max-width: 1200px"
  >
    <div class="d-flex align-center justify-space-between flex-wrap ga-4 mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          Rocket SpaceX
        </h1>
      </div>
      <AddRocketForm />
    </div>

    <v-text-field
      :model-value="store.filter"
      label="Cari berdasarkan nama atau deskripsi"
      prepend-inner-icon="mdi-magnify"
      clearable
      hide-details
      class="mb-4"
      @update:model-value="store.setFilter"
    />

    <RequestState
      :loading="store.listLoading"
      :error="store.listError"
      @retry="store.retryList"
    />

    <p
      v-if="store.filteredRockets.length"
      role="status"
      class="my-4 text-medium-emphasis"
    >
      {{ store.filteredRockets.length }} rocket ditampilkan
    </p>
    <v-row v-if="store.filteredRockets.length">
      <v-col
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>
    <v-alert
      v-else-if="
        !store.listLoading && (store.listLoaded || store.rockets.length)
      "
      type="info"
      variant="tonal"
      class="mt-4"
    >
      {{
        store.filter.trim()
          ? "Tidak ada rocket yang cocok dengan pencarian."
          : "Belum ada rocket untuk ditampilkan."
      }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRocketStore } from "@/stores/rockets";

const store = useRocketStore();
onMounted(() => {
  void store.loadList();
});
</script>

<template>
  <v-container v-if="rocketStore.errorRocket" class="d-flex flex-column justify-center align-center">
    <p>{{ rocketStore.errorRocket }}</p>
    <v-btn @click="retry">Retry</v-btn>
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col md="6" cols="12">
        <v-text-field
          v-model="rocketStore.searchQueryChange"
          placeholder="Cari..."
          dense
          fixed
        />
      </v-col>
      <v-col md="6" cols="12">
        <v-select
          label="Status"
          v-model="rocketStore.statusFilterSelected"
          :items="filterItems.flatMap((e) => e.name)"
          single-line
        />
      </v-col>
    </v-row>
    <v-btn width="100%" prepend-icon="mdi-plus" color="blue" class="mt-6 mb-6" @click="onTapAdd">
      Tambah Rocket
    </v-btn>
    <v-list>
      <BaseLoading v-if="rocketStore.isLoadingList" />
      <v-list-item-title
        v-else-if="filterRocket(rocketStore.searchQueryChange).length == 0 && rocketStore.isLoadingList == false"
        class="d-flex justify-center align-center"
      >
        Tidak ada data
      </v-list-item-title>
      <v-container v-else>
        <RocketCard
          v-for="rocket in filterRocket(rocketStore.searchQueryChange)"
          :key="rocket.id"
          :rocket="rocket"
          @click="onTapItem(rocket.id)"
        />
      </v-container>
    </v-list>
  </v-container>
</template>

<script setup>
  import { useRocketStore } from "@/stores/RocketStore";
  import { FILTER_STATUS } from '@/constant/filterStatus'
  import RocketCard from '../components/RocketCard.vue';

  const rocketStore = useRocketStore();

  const filterItems = FILTER_STATUS;

  function getFilterStatusState() {
    const item = filterItems.filter(
      (e) => e.name == rocketStore.statusFilterSelected
    );

    return item[0].state;
  }

  function filterRocket(searchQuery) {
    return rocketStore.rockets.filter((element) =>
      getFilterStatusState() != null
        ? element.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          element.active == getFilterStatusState()
        : element.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function onTapItem(id) {
    rocketStore.navigateToDetail(id);
  }

  function onTapAdd() {
    rocketStore.resetFormAdd();
    rocketStore.navigateToAdd();
  }

  function retry() {
    rocketStore.getAllRockets();
  }
</script>

<script setup lang="ts">

import { computed, onMounted, ref } from "vue";

import { useRocketStore } from "../stores/rocketStore";

import LoadingState from "../components/LoadingState.vue";
import ErrorState from "../components/ErrorState.vue";

//import ErrorState from "../components/ErrorState.vue"; 

import SearchBar from "../components/SearchBar.vue";
//import RocketTable from "../components/RocketTable.vue";
import RocketTable from "../components/RocketTable.vue";


const store = useRocketStore();

const search = ref("");

onMounted(() => {
  store.loadRockets();
});

const filteredRockets = computed(() => {

  return store.rockets.filter(r =>
      r.name.toLowerCase()
          .includes(search.value.toLowerCase())
  );

});

</script>

<template>

<SearchBar v-model="search"/>

<LoadingState
    v-if="store.loading"
/>

<ErrorState
    v-else-if="store.error"
    @retry="store.loadRockets"
/>

<div v-else>

<RocketTable
    :rockets="filteredRockets"
    @select="store.selectRocket"
/>

<RocketDetail
    :rocket="store.selectedRocket"
/>

</div>

</template>
<template>
  <div>
    <h1>SpaceX Rockets</h1>
    <RocketFilter @filter="setFilter" />
    <Loading v-if="loading" />
    <ErrorRetry v-if="error" @retry="fetchData" />
    <div v-if="!loading && !error">
      <RocketCard
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        :rocket="rocket"
      />
    </div>
    <button @click="addFakeRocket">Add Rocket</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRocketStore } from "../stores/rocketStore";
import RocketCard from "../components/RocketCard.vue";
import RocketFilter from "../components/RocketFilter.vue";
import Loading from "../components/Loading.vue";
import ErrorRetry from "../components/ErrorRetry.vue";

const store = useRocketStore();
const filter = ref("");

onMounted(() => store.fetchRockets());

const setFilter = (val: string) => {
  filter.value = val;
};

const filteredRockets = computed(() =>
  store.rockets.filter((r: any) =>
    r.name.toLowerCase().includes(filter.value.toLowerCase())
  )
);

const fetchData = () => store.fetchRockets();
const addFakeRocket = () => {
  store.addRocket({
    id: Math.random().toString(36),
    name: "New Rocket",
    description: "Added locally",
    flickr_images: [""],
    country: "",
    cost_per_launch: 0,
    first_flight: "",
  });
};
</script>

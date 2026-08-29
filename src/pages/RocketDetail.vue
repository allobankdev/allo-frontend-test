<template>
  <div>
    <button @click="$router.back()">Back</button>
    <Loading v-if="loading" />
    <ErrorRetry v-if="error" @retry="fetchDetail" />
    <div v-if="rocket">
      <h2>{{ rocket.name }}</h2>
      <img :src="rocket.flickr_images[0]" alt="" />
      <p>{{ rocket.description }}</p>
      <p>Cost / Launch: {{ rocket.cost_per_launch }}</p>
      <p>Country: {{ rocket.country }}</p>
      <p>First Flight: {{ rocket.first_flight }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRocketStore } from "../stores/rocketStore";
import Loading from "../components/Loading.vue";
import ErrorRetry from "../components/ErrorRetry.vue";

const route = useRoute();
const store = useRocketStore();

const rocket = ref(null);
const loading = ref(false);
const error = ref(false);

const fetchDetail = async () => {
  loading.value = true;
  error.value = false;
  const data = await store.fetchRocketDetail(route.params.id as string);
  if (!data) error.value = true;
  rocket.value = data;
  loading.value = false;
};

onMounted(fetchDetail);
</script>

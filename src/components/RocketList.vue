<template>
  <div class="rocket-list">
    <div class="d-flex flex-wrap justify-space-between align-center mb-6">
      <h1 class="text-h4 my-4">SpaceX Rockets</h1>

      <div class="d-flex gap-3 flex-wrap">
        <RocketFilter />
        <RocketForm />
      </div>
    </div>

    <Loading v-if="rocketStore.loading" />

    <Error 
      v-else-if="rocketStore.error" 
      :error="rocketStore.error" 
      @retry="fetchRockets" 
    />

    <v-alert
      v-else-if="rocketStore.rockets.length === 0"
      type="info"
      text="No rockets found. Try adjusting your filter or add a new rocket."
    ></v-alert>

    <v-row v-else>
      <v-col
        v-for="rocket in rocketStore.rockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRocketsStore } from '@/stores/rockets';
import RocketCard from './RocketCard.vue';
import RocketFilter from './RocketFilter.vue';
import RocketForm from './RocketForm.vue';
import Loading from './Loading.vue';
import Error from './Error.vue';
const rocketStore = useRocketsStore();
onMounted(() => {
  fetchRockets();
});
const fetchRockets = () => {
  rocketStore.fetchRockets();
};
</script>

<style scoped>
.rocket-list {
  padding: 16px;
}
</style>
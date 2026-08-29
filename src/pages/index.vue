<template>
  <v-container>
    <div class="text-center text-h3 mb-4">SpaceX Rockets</div>

    <LoadingState v-if="loading" />
    <ErrorState v-if="error" @retry="rocketsStore.fetchRockets" />

    <div v-else>
      <Rockets />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRocketsStore } from "@/stores/rocketStore";

const rocketsStore = useRocketsStore();
const { loading, error } = storeToRefs(rocketsStore);
</script>

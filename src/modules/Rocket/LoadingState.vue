<script setup lang="ts">
import { ref } from "vue";

const loading = ref(true);
</script>

<template>
  <div>
    <v-row v-if="loading">
      <v-col cols="12" md="4" v-for="n in 6" :key="n">
        <v-skeleton-loader type="image, article" height="260" />
      </v-col>
    </v-row>

    <div v-else class="text-center py-10">
      <v-progress-circular indeterminate />
    </div>
  </div>
</template>

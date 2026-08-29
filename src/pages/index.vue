<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Rocket List</h1>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Search rocket"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
        />
      </v-col>

      <v-col cols="12" md="6" class="text-md-left mt-2">
        <v-btn color="primary" @click="popUp = true"> Create Rocket </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="loading" justify="center">
      <v-progress-circular indeterminate />
    </v-row>

    <v-row v-if="error" justify="center">
      <v-col cols="12" class="text-center">
        <v-alert class="mb-3" type="error"> Failed to load rockets </v-alert>

        <v-btn color="primary" @click="fetchRockets()"> Retry </v-btn>
      </v-col>
    </v-row>

    <v-row>
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

    <RocketForm v-model="popUp" />
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, computed, ref } from "vue";
import { useRocketStore } from "@/store/index";
import type { RocketList } from "@/types";
import { storeToRefs } from "pinia";
import RocketCard from "@/components/RocketCard.vue";
import RocketForm from "@/components/RocketForm.vue";

const { fetchRockets } = useRocketStore();
const { rockets, loading, error } = storeToRefs(useRocketStore());
const search = ref<string>("");
const popUp = ref(false);

onMounted(() => {
  fetchRockets();
});

const filteredRockets = computed(() =>
  rockets?.value.filter((rocket: RocketList) => {
    return rocket.name.toLowerCase().includes(search.value.toLowerCase());
  }),
);

// console.log(filteredRockets.value, "ini rokcet");
</script>

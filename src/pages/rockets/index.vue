<template>
  <v-container>
    <!-- Skeleton Loader saat loading -->
    <v-row justify="center" v-if="isLoading">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <SkeletonLoader type="card" elevation="2" height="300px" />
      </v-col>
    </v-row>

    <!-- Error Handling -->
    <v-row v-else-if="error">
      <v-col>
        <ErrorComponent @refresh="refetch" />
      </v-col>
    </v-row>

    <!-- Menampilkan Data -->
    <v-row v-else>
      <v-col
        v-for="(item, index) in data?.data"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="6"
      >
        <CardComponent
          :id="item.id"
          :title="item.name"
          :image="item.flickr_images[0]"
          :description="item.description"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import type { Rocket } from "@/types/rocket.type";
import { fetchData } from "@/api/rockets";
import type { ApiResponse } from "@/types/response.type";

const rockets = fetchData();
const { data, isLoading, error, refetch } = useQuery<ApiResponse<Rocket[]>>({
  queryKey: ["rockets"],
  queryFn: () => {
    return rockets;
  },
});
</script>

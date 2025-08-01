<template>
  <v-container>
    <v-row justify="center" v-if="isLoading">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <v-row v-else-if="error">
      <v-col>
        <v-alert type="error">Terjadi kesalahan saat memuat data</v-alert>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="(item, index) in data?.data"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <Card
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
import apiInstance from "@/utils/api";
import type { Rocket } from "@/types/rocket.type";

interface ApiResponse {
  data: Rocket[];
}

const fetchData = async (): Promise<ApiResponse> => {
  const response = await apiInstance.get("/v4/rockets");
  return response;
};

const { data, isLoading, error } = useQuery<ApiResponse>({
  queryKey: ["rockets"],
  queryFn: fetchData,
});
</script>

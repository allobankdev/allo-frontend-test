<template>
  <v-container>
    <FilterComponent
      filter-type="status"
      filter-label="Status"
      :resetRoute="path"
    />
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
      <template v-if="data?.docs && data.docs.length">
        <v-col
          v-for="(item, index) in data?.docs"
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
            :path="path"
          />
        </v-col>
      </template>
      <v-col v-else cols="12" class="text-center">
        <CardNotFound />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import type { Rocket } from "@/types/rocket.type";
import type { ApiResponse, queryData } from "@/types/response.type";
import { useRoute } from "vue-router";
import { computed } from "vue";
import apiInstance from "@/utils/api";

const route = useRoute();
const name = computed(() => (route.query.name as string) || "");
const active = computed(() => (route.query.active as string) || "");
const { path } = useRoute();

const fetchData = async (): Promise<ApiResponse<Rocket[]>> => {
  const query: queryData = {
    name: {
      $regex: name.value,
      $options: "i",
    },
  };

  if (active.value && active.value !== "All") {
    query.active = active.value === "active";
  }

  const { data } = await apiInstance.post("/v4/rockets/query", {
    query,
    options: {},
  });
  return data;
};

const { data, isLoading, error, refetch } = useQuery<ApiResponse<Rocket[]>>({
  queryKey: ["rockets", name, active],
  queryFn: fetchData,
});
</script>

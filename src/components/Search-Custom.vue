<template>
  <v-card class="custom-search" flat>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            outlined
            clearable
            placeholder="Cari..."
            prepend-inner-icon="mdi-magnify"
            v-model="searchInput"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-btn @click="handleFilter" color="primary" class="mr-2">
            <v-icon left>mdi-magnify</v-icon>
            Cari
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Crew } from "@/types/crew.type";
import type { ApiResponse } from "@/types/response.type";
import apiInstance from "@/utils/api";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const searchInput = computed(() => parseInt(route.query.name as string) || "");
// const limit = computed(() => parseInt(route.query.limit as string) || 4);

const fetchData = async (): Promise<ApiResponse<Crew[]>> => {
  const response = await apiInstance.post("/v4/crew/query", {
    query: {
      name: {
        $regex: "robert",
        $options: "i",
      },
    },
    options: {},
  });
  console.log(route.query);
  return response;
};

const handleFilter = () => {
  router.push({
    query: {
      ...route.query,
      name: searchInput.value,
    },
  });
};

const { data, isLoading, error, refetch } = useQuery<ApiResponse<Crew[]>>({
  queryKey: ["crew", searchInput],
  queryFn: fetchData,
});
</script>

<style scoped>
.custom-search {
  border-radius: 8px;
  margin-bottom: 20px;
}
</style>

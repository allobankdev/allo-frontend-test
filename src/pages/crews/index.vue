<template>
  <FormFilter />
  <v-row justify="center" v-if="isLoading">
    <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="6">
      <SkeletonLoader type="card" elevation="2" height="300px" />
    </v-col>
  </v-row>

  <!-- Error Handling -->
  <v-row v-else-if="error">
    <v-col>
      <ErrorComponent @refresh="refetch" />
    </v-col>
  </v-row>

  <v-row v-else>
    <v-col cols="12">
      <h1 class="text-h4 mb-6">SpaceX Crew Members</h1>
    </v-col>

    <!-- Crew Cards -->
    <template v-if="data?.docs && data.docs.length">
      <v-col
        v-for="(crew, index) in data?.docs"
        :key="index"
        cols="12"
        sm="6"
        md="6"
      >
        <CardComponent :id="crew.id" :title="crew.name" :image="crew.image" />
      </v-col>
    </template>

    <!-- Tampilkan pesan jika data kosong -->
    <v-col v-else cols="12" class="text-center">
      <v-card>
        <v-card-text>
          <v-icon size="48" color="grey">mdi-alert-circle-outline</v-icon>
          <div class="text-subtitle-1 mt-2">Data tidak ditemukan</div>
        </v-card-text>
      </v-card>
    </v-col>
    <!-- Pagination -->
    <v-col cols="12" class="mt-6">
      <PaginationCustom />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import apiInstance from "@/utils/api";
import type { Crew } from "@/types/crew.type";
import { useRoute } from "vue-router";
import { computed } from "vue";

interface ApiResponse<T> {
  docs: T;
}

const route = useRoute();

const page = computed(() => parseInt(route.query.page as string) || 1);
const limit = computed(() => parseInt(route.query.limit as string) || 4);
const agency = computed(() => (route.query.agency as string) || "");
const name = computed(() => (route.query.name as string) || "");
interface queryData {
  name: {};
  agency?: {};
}
const fetchData = async (): Promise<ApiResponse<Crew[]>> => {
  const query: queryData = {
    name: {
      $regex: name.value,
      $options: "i",
    },
  };

  if (agency.value && agency.value !== "All") {
    query.agency = agency.value;
  }

  const { data } = await apiInstance.post("/v4/crew/query", {
    query,
    options: {
      limit: limit.value,
      page: page.value,
    },
  });
  return data;
};

const { data, isLoading, error, refetch } = useQuery<ApiResponse<Crew[]>>({
  queryKey: ["crew", page, limit, agency, name],
  queryFn: fetchData,
});
</script>

<style lang="scss" scoped>
.crew-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  img {
    object-position: top;
  }
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &__image {
    transition: transform 0.5s ease;
    object-position: top;

    .crew-card:hover & {
      transform: scale(1.05);
    }
  }
}

.status-chip {
  position: absolute;
  top: 12px;
  right: 12px;
  font-weight: 600;
  text-transform: capitalize;
}
</style>

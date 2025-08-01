<template>
  <v-container>
    <v-row justify="center" v-if="isLoading">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="6">
        <v-skeleton-loader type="card" elevation="2" height="300px" />
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
      <v-col
        v-for="(crew, index) in data?.data.docs"
        :key="index"
        cols="12"
        sm="6"
        md="6"
      >
        <router-link :to="`crews/${crew.id}`" class="text-decoration-none">
          <v-card class="crew-card cursor-pointer" elevation="4">
            <v-img
              :src="crew.image"
              height="400px"
              cover
              position="top"
              class="crew-card__image"
              gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5)"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-icon size="x-large">mdi-account-astronaut</v-icon>
                </v-row>
              </template>

              <v-chip
                class="status-chip"
                :color="crew.status === 'active' ? 'success' : 'error'"
                small
              >
                {{ crew.status }}
              </v-chip>
            </v-img>

            <v-card-title class="text-h6 text-center">
              {{ crew.name }}
            </v-card-title>
          </v-card>
        </router-link>
      </v-col>

      <!-- Pagination -->
      <v-col cols="12" class="mt-6">
        <pagination-custom />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import apiInstance from "@/utils/api";
import type { Crew } from "@/types/crew.type";
import { useRoute } from "vue-router";
import { computed } from "vue";

interface ApiResponse<T> {
  data: {
    docs: T;
  };
}

const route = useRoute();

const page = computed(() => parseInt(route.query.page as string) || 1);
const limit = computed(() => parseInt(route.query.limit as string) || 4);

const fetchData = async (): Promise<ApiResponse<Crew[]>> => {
  const response = await apiInstance.post("/v4/crew/query", {
    query: {},
    options: {
      limit: limit.value,
      page: page.value,
    },
  });
  console.log(route.query);
  return response;
};

const { data, isLoading, error, refetch } = useQuery<ApiResponse<Crew[]>>({
  queryKey: ["crew", page, limit],
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

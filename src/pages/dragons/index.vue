<template>
  <h1>Hello World</h1>
  {{ data }}
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import apiInstance from "@/utils/api";
import { useRoute } from "vue-router";
import { computed } from "vue";
import type { Dragon } from "@/types/dragon.type";

interface ApiResponse<T> {
  data: {
    docs: T;
  };
}

const route = useRoute();

const page = computed(() => parseInt(route.query.page as string) || 1);
const limit = computed(() => parseInt(route.query.limit as string) || 6);

const fetchData = async (): Promise<ApiResponse<Dragon[]>> => {
  const response = await apiInstance.post("/v4/payloads/query", {
    query: {},
    options: {
      limit: limit.value,
      page: page.value,
    },
  });
  console.log(route.query);
  return response;
};

const { data, isLoading, error, refetch } = useQuery<ApiResponse<Dragon[]>>({
  queryKey: ["dragons", page, limit],
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

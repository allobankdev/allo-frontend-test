<template>
  <v-container>
    <FilterComponent
      filter-type="status"
      filter-label="Status"
      :reset-route="path"
    />
    <!-- Skeleton Loader saat loading -->
    <v-row
      v-if="isLoading"
      justify="center"
    >
      <v-col
        v-for="n in 8"
        :key="n"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <SkeletonLoader
          type="card"
          elevation="2"
          height="300px"
        />
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
      <v-col
        v-else
        cols="12"
        class="text-center"
      >
        <CardNotFound />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import type { Rocket } from "@/types/rocket.type";
import type { ApiResponse } from "@/types/api.type";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useRocketsStore } from "@/store/rockets.store";

const rocketsStore = useRocketsStore();
const route = useRoute();
const name = computed(() => (route.query.name as string) || "");
const active = computed(() => (route.query.active as string) || "");
const { path } = useRoute();

const { data, isLoading, error, refetch } = useQuery<ApiResponse<Rocket[]>>({
  queryKey: ["rockets", name, active],
  queryFn: () => rocketsStore.getRockets(name.value, active.value),
});
</script>

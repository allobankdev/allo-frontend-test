<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-4">
      <RocketFormComponent @success="handleRocketAdded" />
    </div>

    <FilterComponent
      filter-type="status"
      filter-label="Status"
      :reset-route="path"
    />

    <!-- Success Message -->
    <v-snackbar
      v-model="showSuccessMessage"
      color="success"
      :timeout="3000"
    >
      <v-icon class="mr-2">
        mdi-check-circle
      </v-icon>
      Rocket added successfully!
    </v-snackbar>

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
            :image="
              item.flickr_images[0] ||
                'https://via.placeholder.com/400x300?text=No+Image'
            "
            :description="item.description"
            :path="path"
            :is-custom="item.id.startsWith('custom_')"
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

    <GoBackButton class="my-5" />
  </v-container>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import type { Rocket } from "@/types/rocket.type";
import type { ApiResponse } from "@/types/api.type";
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import { useRocketsStore } from "@/stores/rockets.store";

const rocketsStore = useRocketsStore();
const route = useRoute();
const showSuccessMessage = ref(false);

const name = computed(() => (route.query.name as string) || "");
const active = computed(() => (route.query.active as string) || "");
const { path } = useRoute();

const { data, isLoading, error, refetch } = useQuery<ApiResponse<Rocket[]>>({
  queryKey: ["rockets", name, active],
  queryFn: () => rocketsStore.getRockets(name.value, active.value),
});

const handleRocketAdded = (newId: string) => {
  showSuccessMessage.value = true;
  refetch();
  console.log("New rocket added with ID:", newId);
};
</script>

<style lang="scss" scoped></style>

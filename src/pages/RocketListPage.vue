<template>
  <v-container>
    <!-- HEADER -->
    <v-row class="mb-4" align="center">
      <v-col cols="8">
        <v-text-field
          label="Search rocket"
          variant="outlined"
          @update:model-value="store.setSearch"
        />
      </v-col>

      <v-col cols="4" class="d-flex justify-end align-center">
        <RocketForm />
      </v-col>
    </v-row>

    <v-row>
      <!-- LOADING -->
      <template v-if="store.loading">
        <v-col v-for="n in 6" :key="n" cols="12" md="4">
          <SkeletonLoader />
        </v-col>
      </template>

      <!-- ERROR -->
      <template v-else-if="store.error">
        <v-col cols="12">
          <Error :message="store.error" @retry="store.fetchRockets" />
        </v-col>
      </template>

      <!-- DATA -->
      <template v-else>
        <v-col
          v-for="rocket in store.paginatedRockets"
          :key="rocket.id"
          cols="12"
          md="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </template>
    </v-row>

    <!-- PAGINATION -->
    <v-row justify="center" class="mt-6">
      <v-pagination
        v-model="store.page"
        :length="store.totalPages"
        @update:model-value="store.setPage"
      />
    </v-row>

    <v-row justify="center" class="mt-2">
      <v-chip color="primary" variant="tonal">
        Page {{ store.page }} / {{ store.totalPages }}
      </v-chip>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRocketStore } from "@/store/rocket.store";
import RocketCard from "@/components/RocketCard.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import Error from "@/components/Error.vue";
import RocketForm from "@/components/RocketForm.vue";

const store = useRocketStore();

onMounted(() => {
  store.fetchRockets();
});
</script>

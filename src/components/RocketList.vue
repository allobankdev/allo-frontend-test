<template>
  <!-- Skeleton loading -->
  <div v-if="props.isLoading" class="d-flex flex-column ga-4">
    <v-card
      v-for="(n, idx) in 5"
      :key="idx"
      height="150"
      elevation="4"
      rounded="lg"
    >
      <v-row no-gutters>
        <!-- IMAGE -->
        <v-col cols="4">
          <v-skeleton-loader type="image" height="120" />
        </v-col>

        <!-- TEXT -->
        <v-col cols="8" class="pa-2">
          <v-card-title class="text-h6 font-weight-bold">
            <v-skeleton-loader type="text" />
          </v-card-title>

          <v-card-text>
            <v-skeleton-loader type="text" />
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </div>

  <!-- Actual content -->
  <div v-else class="d-flex flex-column ga-4">
    <RocketCard :data="props.data" @to-rocket-detail="toRocketDetail" />
  </div>
</template>

<script setup lang="ts">
import type { Rocket } from "@/types/rockets";
import { useRouter } from "vue-router";

const router = useRouter();

function toRocketDetail(id: string) {
  router.push(`rocket/${id}`);
}

const props = defineProps<{ data: Rocket[]; isLoading: boolean }>();
</script>

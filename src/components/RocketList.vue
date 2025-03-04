<script lang="ts" setup>
import CardSkeleton from "@/components/CardSkeleton.vue";
import CardRocket from "@/components/CardRocket.vue";
import type { Rocket } from "@/types/rocket";

defineProps<{
  data: Rocket[];
  isLoading: boolean;
  error: string;
}>();
const emit = defineEmits<{
  (event: "retry"): void;
}>();

</script>

<template>
  <Error
    v-if="error"
    :error="error"
    @retry="emit('retry')"
  />

  <v-row v-else-if="isLoading">
    <CardSkeleton />
  </v-row>

  <v-row v-else-if="data.length > 0">
    <v-col
      v-for="rocket in data"
      :key="rocket.id"
      cols="12"
      md="6"
    >
      <CardRocket :rocket="rocket" />
    </v-col>
  </v-row>

  <div
    v-else
    class="d-flex flex-column text-center pa-10 ga-4"
  >
    <p>No data available</p>
  </div>
</template>

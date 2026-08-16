<template>
  <v-row>
    <v-col
      v-for="rocket in rockets"
      :key="rocket.id"
      cols="12"
      sm="6"
      lg="4"
    >
      <RocketCard :rocket="rocket" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Rocket } from "@/types/rocket";

defineProps<{
  rockets: Rocket[];
}>();
</script>

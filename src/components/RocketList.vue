<template>
  <v-row>
    <v-col
      v-for="rocket in rockets"
      :key="rocket.id"
      cols="12"
      md="4"
      sm="6"
    >
      <RocketCard :rocket="rocket" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import type { Rocket } from "@/types";

  defineProps<{
    rockets: Rocket[];
  }>();
</script>

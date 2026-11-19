<template>
  <v-container class="py-8">
    <v-btn
      class="mb-6"
      prepend-icon="mdi-arrow-left"
      variant="text"
      :to="{ path: '/' }"
    >
      Back to list
    </v-btn>

    <h1 class="text-h5 font-weight-bold mb-2">
      Rocket detail
    </h1>
    <p class="text-body-1 text-medium-emphasis">
      Detail screen for rocket
      <strong>{{ id }}</strong>
      comes next.
    </p>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed } from "vue";
  import { useRoute } from "vue-router";

  const route = useRoute();
  const id = computed(() => String(route.params.id));
</script>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const rocketId = route.params.id;
</script>

<template>
  <div>
    <h1>Rocket Detail - {{ rocketId }}</h1>
  </div>
</template>

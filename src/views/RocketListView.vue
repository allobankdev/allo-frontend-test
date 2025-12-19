<script setup lang="ts">
import { onMounted } from "vue";
import { getRockets } from "@/services/rocketService";

onMounted(async () => {
  const rockets = await getRockets();
  console.log("Rockets:", rockets);
});
</script>

<template>
  <div>Check console for rocket data</div>
</template>

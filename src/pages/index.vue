<template>
  <RocketList :data="data" :is-loading="isLoading" />
</template>

<script lang="ts" setup>
import { getAllRockets } from "@/services/rocket";
import { useQuery } from "@tanstack/vue-query";

const { data, isLoading } = useQuery({
  queryKey: ["rockets"],
  queryFn: getAllRockets,
});
// watch(data, (val) => {
//   console.log("ROCKETS FETCHED:", val);
// });
</script>

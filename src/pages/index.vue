<template>
  <HelloWorld />
  <li v-for="(rocket, idx) in data" :key="idx">
    {{ rocket.height }}
  </li>
</template>

<script lang="ts" setup>
import { getRockets } from "@/services/rocket";
import type { Rocket } from "@/types/rockets";
import { useQuery } from "@tanstack/vue-query";
import {  ref, } from "vue";

const rockets = ref<Rocket[]>([]);

const { isPending, isError, data, error } = useQuery({
  queryKey: ["rockets"],
  queryFn: getRockets,
});
// watch(data, (val) => {
//   console.log("ROCKETS FETCHED:", val);
// });
</script>

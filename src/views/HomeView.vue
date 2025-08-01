<script setup lang="ts">
import apiInstance from "@/utils/api";
import { useQuery } from "@tanstack/vue-query";

const fetchData = async () => {
  const response = await apiInstance.get("/v4/rockets");
  console.log(response);
};

const { data, isLoading, error } = useQuery({
  queryKey: ["data"],
  queryFn: fetchData,
});
</script>

<template>
  <section>
    <h1>Hello World</h1>
  </section>
</template>

<style lang="scss" scope></style>

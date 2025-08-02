<template>
  <v-btn @click="goBack" color="primary">
    <v-icon left>mdi-arrow-left</v-icon>
    Back
  </v-btn>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();
const goBack = () => {
  router.go(-1);
};
</script>

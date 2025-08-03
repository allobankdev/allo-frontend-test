<template>
  <v-btn
    color="primary"
    @click="goBack"
  >
    <v-icon left>
      mdi-arrow-left
    </v-icon>
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
